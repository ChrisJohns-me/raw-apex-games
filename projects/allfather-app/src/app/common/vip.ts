/**
 * Cuz fuck yeah.
 */
export function aXNWSVA(overwolfUsername: string): boolean {
    const vipList = [
        "bWFzdGVya3JpZmY=", // masterkriff
        "ZXRoYW50aGVvZGQ=", // ethantheodd
    ];
    if (!window) return false;
    return vipList.includes(window.btoa(overwolfUsername));
}
