/**
 * Cuz fuck yeah.
 */
export function aXNWSVA(overwolfUsername: string): boolean {
    const vipList = [
        "bWFzdGVya3JpZmY=", // masterkriff
    ];
    return vipList.includes(btoa(overwolfUsername));
}
