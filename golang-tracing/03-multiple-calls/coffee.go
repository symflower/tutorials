package main

import (
	"context"
	"os"
	"runtime/trace"
	"time"
)

func main() {
	traceFile, err := os.Create("coffee.trace")
	if err != nil {
		panic(err)
	}
	if err = trace.Start(traceFile); err != nil {
		panic(err)
	}
	defer func() {
		trace.Stop()
		if err := traceFile.Close(); err != nil {
			panic(err)
		}
	}()

	ctx := context.Background()
	ctx, task := trace.NewTask(ctx, "main")
	defer task.End()

	makeCappuccino(ctx)
	makeCappuccino(ctx)
	makeCappuccino(ctx)
}

func makeCappuccino(ctx context.Context) {
	ctx, task := trace.NewTask(ctx, "makeCappuccino")
	defer task.End()

	steamMilk(ctx)
	foamMilk(ctx)
	extractCoffee(ctx)
	mixMilkCoffee(ctx)
}

func steamMilk(ctx context.Context) {
	ctx, task := trace.NewTask(ctx, "steamMilk")
	defer task.End()

	time.Sleep(100 * time.Millisecond)
}

func foamMilk(ctx context.Context) {
	ctx, task := trace.NewTask(ctx, "foamMilk")
	defer task.End()

	time.Sleep(200 * time.Millisecond)
}

func extractCoffee(ctx context.Context) {
	ctx, task := trace.NewTask(ctx, "extractCoffee")
	defer task.End()

	time.Sleep(300 * time.Millisecond)
}

func mixMilkCoffee(ctx context.Context) {
	ctx, task := trace.NewTask(ctx, "mixMilkCoffee")
	defer task.End()

	time.Sleep(500 * time.Millisecond)
}
