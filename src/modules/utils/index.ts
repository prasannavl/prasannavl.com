export function reverseArray(arr: any[]) {
    let len = arr.length;
    let res: any = new Array(len);
    let maxIndex = len - 1;
    for (let i = 0; i < len; i++) {
        res[i] = arr[maxIndex - i];
    }
    return res;
}