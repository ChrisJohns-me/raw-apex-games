/**
 * Cuz fuck yeah.
 */
export function aXNWSVA(overwolfUsername: string): boolean {
    const vipList = [
        "bWFzdGVya3JpZmY=", // masterkriff
        "ZmlzaGx5bmU=", // fishlyne
    ];
    if (!window) return false;
    return vipList.includes(window.btoa(overwolfUsername));
}
