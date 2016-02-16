class Guards {
    checkString(item) {
        return item !== null || item !== undefined;
    }
}

export default new Guards();