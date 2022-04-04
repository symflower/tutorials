package step2

func babyHash(in int) int {
	div := 3
	for i := 0; i < 3; i++ {
		in = div / in
		div = div + in
	}

	return div
}
