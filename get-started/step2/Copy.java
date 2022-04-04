package step2;

class Copy {
    static String[] copy(String[] from, String[] to) {
        for (int i = 0; i < from.length; i++) {
            to[i] = from[i];
        }

        return to;
    }
}
