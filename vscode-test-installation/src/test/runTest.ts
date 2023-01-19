import * as cp from 'child_process';
import * as crypto from 'crypto';
import * as syncfs from 'fs';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import * as stream from 'stream';
import * as unzipper from 'unzipper';
import { runTests } from '@vscode/test-electron';
import { downloadDirToExecutablePath, systemDefaultPlatform } from '@vscode/test-electron/out/util';

const axios = require('axios'); // REMARK We have to use "require" for this import since default imports don't seem to work.

/** VSCodeVersionInfo holds information about a VS Code release. */
interface VSCodeVersionInfo {
	url: string;
	name: string;
	sha256hash: string;
}

/** VSCodeArchiveInfo holds information about an archive file used to install VS Code. */
interface VSCodeArchiveInfo {
	path: string;
	format: 'zip' | 'tgz';
}

/** fetchLatestVSCodeVersion fetches information about the latest VS Code release. */
async function fetchLatestVSCodeVersion(): Promise<VSCodeVersionInfo> {
	const versions = await axios.get('https://update.code.visualstudio.com/api/releases/stable');
	const latest = versions.data[0];
	return (await axios.get(`https://update.code.visualstudio.com/api/versions/${latest}/${systemDefaultPlatform}/stable`)).data;
}

/** fileExists returns whether a file exists at the given path. */
async function fileExists(filePath: string): Promise<boolean> {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch (err) {
		return false;
	}
}

/** hashBuffer returns the SHA256 hash of the contents of the given buffer as a hexadecimal string. */
function hashBuffer(buffer: Buffer): string {
	return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * downloadVSCode downloads the archive file of the given VS Code version into the given directory and verifies its integrity.
 *
 * If the archive file already exists and the integrity check succeeds, it is not downloaded again. Downloads are retried a limited amount of times on failure.
 *
 * @param cachePath holds the directory where the archive file will be placed after downloading.
 * @param versionInfo holds information about the version to download.
 * @returns information about the downloaded archive file.
 */
async function downloadVSCode(versionInfo: VSCodeVersionInfo, cachePath: string): Promise<VSCodeArchiveInfo> {
	const fileType = versionInfo.url.endsWith('.zip') ? 'zip' : 'tgz';
	const archivePath = path.join(cachePath, versionInfo.name + (fileType === 'zip' ? '.zip' : '.tar.gz'));

	for (let i = 0; ; i++) {
		if (await fileExists(archivePath)) {
			const content = await fs.readFile(archivePath);
			const hash = hashBuffer(content);
			if (hash === versionInfo.sha256hash) {
				break;
			}
		}

		if (i === 5) {
			throw new Error(`Failed to download VS Code ZIP file in ${i} tries`);
		}

		console.debug(`Downloading VS Code version ${versionInfo.name}... (try ${i + 1})`);
		const response = await axios.get(versionInfo.url, {
			responseType: 'arraybuffer',
		});
		await fs.writeFile(archivePath, Buffer.from(response.data));
	}

	return {
		format: fileType,
		path: archivePath,
	};
}

/**
 * extractVSCode extracts a VS Code release archive into the given directory.
 *
 * REMARK This function is copied from https://github.com/microsoft/vscode-test/blob/a99a03ba553789cdbfcb48ea5c2305e0117a806b/lib/download.ts#L117, with minor adaptations. The "@vscode/test-electron" library doesn't export that function.
 *
 * @param archiveFile holds information about the release archive to extract.
 * @param installationPath holds a path to the directory to extract the VS Code installation into.
 */
async function extractVSCode(archiveFile: VSCodeArchiveInfo, installationPath: string) {
	await fs.rm(installationPath, {
		force: true,
		recursive: true,
	});

	if (archiveFile.format === 'zip') {
		// note: this used to use Expand-Archive, but this caused a failure
		// on longer file paths on windows. Instead use unzipper, which does
		// not have this limitation.
		//
		// However it has problems that prevent it working on OSX:
		// - https://github.com/ZJONSSON/node-unzipper/issues/216 (avoidable)
		// - https://github.com/ZJONSSON/node-unzipper/issues/115 (not avoidable)
		if (process.platform === 'win32') {
			await spawnDecompressorChild('powershell.exe', [
				'-NoProfile',
				'-ExecutionPolicy',
				'Bypass',
				'-NonInteractive',
				'-NoLogo',
				'-Command',
				`Microsoft.PowerShell.Archive\\Expand-Archive -Path "${archiveFile.path}" -DestinationPath "${installationPath}"`,
			]);
		} else if (process.platform !== 'darwin') {
			await new Promise((resolve, reject) =>
				syncfs
					.createReadStream(archiveFile.path)
					.pipe(unzipper.Extract({ path: installationPath }))
					.on('close', resolve)
					.on('error', reject),
			);
		} else {
			// darwin or *nix sync
			await spawnDecompressorChild('unzip', ['-q', archiveFile.path, '-d', installationPath]);
		}
	} else {
		// tar does not create extractDir by default
		fs.mkdir(installationPath, { recursive: true });
		await spawnDecompressorChild('tar', ['-xzf', archiveFile.path, '--strip-components=1', '-C', installationPath]);
	}
}

/** spawnDecompressorChild is copied from https://github.com/microsoft/vscode-test/blob/a99a03ba553789cdbfcb48ea5c2305e0117a806b/lib/download.ts#L165 and only used in {@link extractVSCode}. */
function spawnDecompressorChild(command: string, args: ReadonlyArray<string>, input?: stream.Readable) {
	const child = cp.spawn(command, args, { stdio: 'pipe' });
	input?.pipe(child.stdin);
	child.stderr.pipe(process.stderr);
	child.stdout.pipe(process.stdout);

	return new Promise<void>((resolve, reject) => {
		child.on('error', reject);
		child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Failed to unzip archive, exited with ${code}`))));
	});
}

async function installVSCode(cachePath: string, installationPath: string): Promise<string> {
	await fs.mkdir(cachePath, {
		recursive: true,
	})

	const latestVersion = await fetchLatestVSCodeVersion();
	const archive = await downloadVSCode(latestVersion, cachePath);
	await extractVSCode(archive, installationPath);
	return downloadDirToExecutablePath(installationPath, systemDefaultPlatform);
}

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		const cachePath = '.vscode-test-archives';
		const installationPath = path.join(os.tmpdir(), 'vscode-test-installation');

		const vscodeExecutablePath = await installVSCode(cachePath, installationPath);

		await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
			vscodeExecutablePath,
		});

	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
