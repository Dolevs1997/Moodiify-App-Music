import styles from "./VideoSong.module.css";
import PropTypes from "prop-types";

function VideoSong({ videoSong }) {
  console.log("videoSong", videoSong);
  return <div className={styles.videoSong}></div>;
}

VideoSong.propTypes = {
  videoSong: PropTypes.shape({
    videoId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    regionCode: PropTypes.string.isRequired,
  }).isRequired,
};

export default VideoSong;
