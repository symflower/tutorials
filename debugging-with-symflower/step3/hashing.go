package step3

func babyHash(in int) int {
	div := 3
	for i := 0; i < 3; i++ {
		if div == 0 {
			div = 3
		}
		in = in / div
		div = div + in
	}

	return div
}
