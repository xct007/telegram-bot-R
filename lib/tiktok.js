import axios from "axios";
import configs from "../config.js";

/**
 * @param {string} str
 * @returns {string[]}
 */
function getTiktokUrls(str) {
	const pattern =
		/^.*https:\/\/(?:m|www|vm)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|&item_id=)(\d+))|\w+)/gm;

	try {
		return str.match(pattern);
	} catch (e) {
		return null;
	}
}

/**
 * @param {string} url
 * @returns {Promise<{url: string, desc: string}|null>}
 */
async function getTiktokVideo(url) {
	const { data } = await axios
		.request({
			baseURL: "https://api.itsrose.life",
			url: "/downloader/tiktok",
			method: "GET",
			headers: {
				Authorization: "Bearer " + configs["itrose_apikey"],
			},
			params: {
				url,
			},
		})
		.catch((e) => e?.response);
	const { status, download, desc } = data;
	if (!status) return null;
	return { url: download.nowm, desc };
}

/**
 * @param {import("telegraf").Context} m
 * @returns {Promise<void>}
 */
export async function getTiktokVideoFromText(m) {
	const urls = getTiktokUrls(m.text);
	if (!urls) return;
	await m.sendChatAction("upload_video");
	const videos = [];
	for await (const url of urls) {
		const video = await getTiktokVideo(url);
		if (video) {
			videos.push({
				media: { url: video.url },
				type: "video",
				caption: video.desc || "No Description",
				has_spoiler: true,
			});
		}
	}
	if (videos.length) {
		await m.replyWithMediaGroup(videos, {
			reply_to_message_id: m.message_id,
		});
	}
}
