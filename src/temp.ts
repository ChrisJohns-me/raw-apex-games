interface Object {
    __$id: () => number;
}

(function () {
    let __$id = 0;

    function generateId() {
        return __$id++;
    }

    Object.prototype.__$id = function () {
        const newId = generateId();

        this.__$id = function () {
            return newId;
        };

        return newId;
    };
})();
