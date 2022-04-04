package step2;

public class Hashing {
    public static int babyHash(int in) {
        int div = 3;
        for (int i = 0; i < 3; i++) {
            in = div / in;
            div = div + in;
        }

        return div;
    }
}
