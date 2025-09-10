import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";
function PoiMarker({ position }) {
  return (
    <>
      <AdvancedMarker position={position}>
        <Pin background={"#181997"} glyphColor={"#fff"} borderColor={"#000"} />
      </AdvancedMarker>
    </>
  );
}

PoiMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

<Pin background={"#181997"} glyphColor={"#fff"} borderColor={"#000"} />;
export default PoiMarker;
