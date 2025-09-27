import Categories from "../../components/Categories/Categories";
import Logo from "../../components/Logo/Logo";
import Search from "../../components/Search/Search";
import { useEffect, useState } from "react";
import Form from "../../components/Form/Form";
import Songs from "../../components/Songs/Songs";
import NavBar from "../../components/NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import MapComponent from "../../components/Map/MapComponent";

export default function Home() {
  const [formVisible, setFormVisible] = useState(false);
  const [songSuggestions, setSongSuggestions] = useState([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);

  // console.log("location at home:", location);
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");

    setIsLoading(true);

    if (!user) {
      setIsLoading(false);
      setError("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }
    setIsLoading(false);
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, [navigate]);

  useEffect(() => {
    if (isMapVisible) {
      navigate("/global");
    }
  }, [isMapVisible, navigate]);

  const handleFormVisible = () => setFormVisible(!formVisible);

  return (
    <main className="home">
      <section className="header">
        <Logo />
        {!isLoading && !error && (
          <Search
            handleFormVisible={handleFormVisible}
            setFormVisible={setFormVisible}
            isMapVisible={isMapVisible}
            setIsMapVisible={setIsMapVisible}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            userData={userData}
            setSongSuggestions={setSongSuggestions}
          />
        )}
        <NavBar user={userData} />
      </section>
      <div className="homeContainer">
        {!isLoading && !error && (
          <>
            {formVisible && !isMapVisible && (
              <Form
                setSongSuggestions={setSongSuggestions}
                handleFormVisible={handleFormVisible}
              />
            )}
            {songSuggestions.length == 0 && !isMapVisible && (
              <Categories user={userData} />
            )}

            {songSuggestions.length > 0 &&
              !isMapVisible &&
              isRecording === false && (
                <Songs songSuggestions={songSuggestions} user={userData} />
              )}

            {isMapVisible && <MapComponent />}
          </>
        )}
      </div>
    </main>
  );
}
