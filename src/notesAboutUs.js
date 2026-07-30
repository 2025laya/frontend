import "./section4.css";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import { useState } from "react";
export default function Sec5({
  state,
  setpage,
  addBookComment,
  bookId,
  selectedBook
}) {
  const { t } = useTranslation();

  const font =
    i18n.language === "ar"
      ? "elmesriRegular, sans-serif"
      : i18n.language === "zh" || i18n.language === "ja"
      ? "zheng"
      : i18n.language === "ko"
      ? "Dongle"
      : "playpen, sans-serif";

  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  const isDisabled =
    rating === 0 || text.trim() === "";

  async function handleSubmit() {
    if (rating === 0 || text.trim() === "") {
      return;
    }

    try {
      const newComment = {
  id: Date.now(),
  // bookId: bookId,
  text: text.trim(),
  rating: rating,
  addedBy:selectedBook?.addedBy||"Anonymous"
};

addBookComment(newComment);

      setText("");
      setRating(0);

      setpage("home");
    } 
    catch (err) {
      console.log(err);
    }
  }

  function go_to_home() {
    setpage("home");
  }
  return (
    <div className="headComment">
      <h1
        style={{
          fontFamily: font,
          color: state ? "#e2dfe4" : "#1E1B4B"
        }}
      >
        {t("title1")}
        <br />
        <span
          style={{
            color: "#6366F1",
            fontFamily: font
          }}
        >
          {t("title2")}
        </span>
      </h1>

      <h4
        style={{
          fontFamily: font,
          color: state ? "#e2dfe4" : "#1E1B4B"
        }}
      >
        {t("com4")} :
      </h4>

      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              fontSize: "30px",
              cursor: "pointer",
              color: star <= rating ? "gold" : "gray"
            }}
          >
            ★
          </span>
        ))}
      </div>

      <div>
        <h3
          style={{
            fontFamily: font,
            color: state ? "#e2dfe4" : "#1E1B4B"
          }}
        >
          {t("com5")}
        </h3>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={150}
          rows="4"
          cols="70"
          placeholder={t("writeReasonHere")}
          style={{
            borderRadius: "15px",
            paddingLeft: "10px",
            borderColor: "#6366F1",
            borderWidth: "5px",
            fontFamily: font
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "100px" }}>
        <button
          disabled={isDisabled}
          onClick={handleSubmit}
          className="clickButt"
          style={{
            backgroundColor: isDisabled ? "gray" : "#eeaeca",
            cursor: isDisabled ? "not-allowed" : "pointer",
            color: isDisabled ? "white" : "black",
            fontFamily: font
          }}
        >
          {t("but1")}
        </button>

        <button
          className="clickButt"
          onClick={go_to_home}
          style={{
            fontFamily: font
          }}
        >
          {t("but2")}
        </button>
      </div>
    </div>
  );
}