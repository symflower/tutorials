package step3;

class Copy {
    static String[] copy(String[] from, String[] to) {
        if (from == null || to == null) {
            throw new IllegalArgumentException();
        }

        for (int i = 0; i < from.length; i++) {
            to[i] = from[i];
        }

        return to;
    }
}
