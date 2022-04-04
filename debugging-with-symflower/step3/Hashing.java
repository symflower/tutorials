package step3;

public class Hashing {
    public static int babyHash(int in) {
        int div = 3;
        for (int i = 0; i < 3; i++) {
            if (div == 0) {
                div = 3;
            }
            in = in / div;
            div = div + in;
        }

        return div;
    }
}
