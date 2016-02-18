class Guard {
    checkString(item) {
        return item !== null || item !== undefined;
    }
}

export default new Guard();