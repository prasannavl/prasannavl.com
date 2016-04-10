export class ArrayUtils {
    static reverse(arr: any[]) {
        let len = arr.length;
        let res: any = new Array(len);
        let maxIndex = len - 1;
        for (let i = 0; i < len; i++) {
            res[i] = arr[maxIndex - i];
        }
        return res;
    }
}

export class StringUtils {
    static joinWithSpaceIfNotEmpty(source: string, addition: string) {
        if (!source) return addition;
        return source + " " + addition;
    }
}