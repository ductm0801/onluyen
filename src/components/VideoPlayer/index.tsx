"use client";
import { updateLessonProgress } from "@/services";
import { SourceInfo } from "plyr";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type VideoPlayerProps = {
  videoSrc: string;
  videoRef: any;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  lessonId: string | undefined;
};
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  setIsPlaying,
  videoRef,
  lessonId,
}) => {
  const ref = useRef<any>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const apiCalledRef = useRef(false); // Use useRef instead of useState
  const videoOptions: SourceInfo = {
    type: "video",

    sources: [
      {
        src: videoSrc,
        provider: "youtube",
      },
    ],
  };
  const plyrOptions = {
    controls: [
      "rewind", // Quay lại
      "play", // Phát/tạm dừng
      "fast-forward", // Tua nhanh
      "progress", // Thanh tiến trình
      "current-time", // Thời gian hiện tại
      "duration", // Thời gian đầy đủ
      "mute", // Tắt tiếng
      "volume", // Điều chỉnh âm lượng
      "captions", // Chọn phụ đề
      "settings", // Menu cài đặt
      "pip", // Chế độ hình trong hình (Safari)
      "airplay", // Airplay (Safari)
      "download", // Nút tải xuống
      "fullscreen", // Toàn màn hình
      "play-large", // Nút phát lớn khi video dừng
    ],
  };
  useImperativeHandle(videoRef, () => ({
    playVideo: () => {
      if (ref.current) {
        ref.current.plyr.play();
      }
    },
    pauseVideo: () => {
      if (ref.current) {
        ref.current.plyr.pause();
      }
    },
  }));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (ref.current) {
        const player = ref.current.plyr;
        if (player) {
          player.on("ready", () => {
            const duration = player?.embed?.getDuration?.();
            if (duration) {
              setVideoDuration(duration);
            }
          });
          player.on("statechange", (event: any) => {
            const state = event.detail.plyr?.embed?.getPlayerState();

            switch (state) {
              case -1:
                // console.log("Video chưa bắt đầu.");
                break;
              case 0:
                // console.log("Video đã kết thúc.");
                break;
              case 1:
                // console.log("Video đang phát.");
                setIsPlaying(true);

                // isPause.current = false;
                break;
              case 2:
                // console.log("Video đang tạm dừng.");
                setIsPlaying(false);
                // isPause.current = true;
                break;
              case 3:
                // console.log("Video đang tải dữ liệu.");

                break;
              default:
                // console.log("Trạng thái không xác định.");
                break;
            }
          });
          player.on("timeupdate", async () => {
            const currentTime = player?.embed?.getCurrentTime?.();
            if (
              currentTime &&
              videoDuration &&
              currentTime >= videoDuration * 0.8 &&
              !apiCalledRef.current &&
              lessonId
            ) {
              console.log("Gọi API tại 80% video!");
              apiCalledRef.current = true;
              try {
                await updateLessonProgress(lessonId || "");
              } catch (error) {
                console.error("Failed to update lesson progress:", error);
                apiCalledRef.current = false;
              }
            }
          });
        } else {
          console.error("Plyr ref is null");
        }
      } else {
        console.error("Ref is still null after timeout");
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [ref.current, videoDuration, lessonId]);

  return <Plyr source={videoOptions} ref={ref} options={plyrOptions} />;
};

export default React.memo(VideoPlayer);
