import AcademyVideoListJSONData from "./academy.json";

export class AcademyVideoCategory {
    constructor(public id: string, public friendlyName: string, public order: number, public videos: AcademyVideo[]) {}
}

export class AcademyVideo {
    constructor(public youtubeVideoId: string, public friendlyName: string, public order: number) {
        if (this.youtubeVideoId.length < 10) throw new Error(`Invalid YouTube video ID: ${this.youtubeVideoId}`);
    }

    public thumbnailUrl(quality: "0" | "default" | "mqdefault" | "sddefault" | "hqdefault" | "maxresdefault" = "mqdefault"): string {
        return `https://img.youtube.com/vi/${this.youtubeVideoId}/${quality}.jpg`;
    }
}

export const AcademyVideoCategoryList: AcademyVideoCategory[] = AcademyVideoListJSONData.videoCategories.map((category) => {
    const categoryVideos: AcademyVideo[] = category.videos.map(
        (video) => new AcademyVideo(video.youtubeVideoId, video.friendlyName, video.order)
    );
    return new AcademyVideoCategory(category.id, category.friendlyName, category.order, categoryVideos);
});
