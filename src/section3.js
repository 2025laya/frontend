import "./section3.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import React from "react";
import { motion } from "framer-motion";
import Text from "./Text";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import colorimg from "./images/colorimg.png";
import blackimg from "./images/blackimg.png";
import colorsave from "./images/savecolor.png";
import blacksave from "./images/saveblack.png";
import "swiper/css";
import "swiper/css/pagination";

export default function Sec3({ state, setpage, setSelectedBook }) {
  const { t } = useTranslation();
  const font =
    i18n.language === "ar"
      ? "elmesriRegular, sans-serif"
      : i18n.language === "zh" || i18n.language === "ja"
        ? "zheng"
        : i18n.language === "ko"
          ? "Dongle"
          : "playpen, sans-serif";
  const currentDir = i18n.language === "ar" ? "rtl" : "ltr";
  const [books, setBooks] = useState([]);
  const [love, setlove] = useState({});
  const [save, setsave] = useState({});
  const [lovearry,setlovearry]=useState([]);

  function islove(bookid) {
    setlove((prevlove) => ({
      ...prevlove,
      [bookid]: !prevlove[bookid],
    }));
  }
  function issave(bookid) {
    setsave((prevsave) => ({
      ...prevsave,
      [bookid]: !prevsave[bookid],
    }));
  }
  useEffect(()=>{
    const loveBooks=books.filter(book=>love[book._id]);
    const savebook=books.filter(book=>save[book._id]);
    localStorage.setItem("lovebook",JSON.stringify(loveBooks));
    localStorage.setItem("savebook",JSON.stringify(savebook));
  },[love,books,save])

  function issave(bookid){
  setsave((prevsave)=>({
    ...prevsave,[bookid]:!prevsave[bookid],}))}

    

  async function Bookss() {
    try {
      let get = await fetch("http://localhost:3000/api/books");
      get = await get.json();
      console.log(get);
      setBooks(get);
    } catch (err) {
      console.log(err);
    }
  }

  function viewAll() {
    setpage("viewAll");
  }

  useEffect(() => {
    Bookss();
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
  }, [books]);

  function goToBook(book) {
    setSelectedBook(book);
    setpage("TheBook");
  }

  return (
    <div>
      <div className="title3">
        <div style={{ display: "flex", gap: "10px" }}>
          <motion.h2
            className="The-Title-Of-Section"
            style={{
              fontFamily: font,
              color: state ? "#e2dfe4" : "#1E1B4B",
              fontSize: "27px",
              transition: "0.3s",
            }}
          >
            {t("classify")} :
          </motion.h2>

          <motion.select
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, axis: "y", amount: 0.8 }}
            transition={{ duration: 0.5 }}
            className="sel sel1"
            style={{ fontFamily: font }}
          >

            <option style={{ fontFamily: font }}>
              {t("date")}
            </option>
            <option style={{ fontFamily: font }}>
              {t("auth")}
            </option>
            <option style={{ fontFamily: font }}>
             {t("ser")}
            </option>

          </motion.select>
        </div>

        <motion.a
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, axis: "y", amount: 0.8 }}
          transition={{ duration: 0.5 }}
          href="####"
          className="view"
          onClick={viewAll}
          style={{
            fontFamily: font,
            color: state ? "#e2dfe4" : "#1E1B4B",
          }}
        >
          {t("view")}
        </motion.a>
      </div>

      <div className="sec33">
        <div className="slider-container">
          <motion.div
            className="slider-container"
            viewport={{ once: true, axis: "y", amount: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Swiper
              dir={currentDir}
              key={currentDir}
              // style={{paddingTop:"80px",paddingBottom:"80px"}}
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={2}
              breakpoints={{
                300: {
                  slidesPerView: 2,
                  // spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  // spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 5,
                  // spaceBetween: 50,
                },
              }}
            >
              {books.slice(0, 8).map((book) => (
                <SwiperSlide key={book._id}>
                  <div
                    className="card"
                    style={{
                      fontFamily: font,
                      // marginTop: "50px",
                      // marginBottom: "50px",
                    }}
                  >
                    <div className="card__shine"></div>

                    <div className="card__glow"></div>
                    <div className="card__content">
                      <div className="card__image">
                        <img src={book.cover} alt={book.title} />
                      </div>

                      <div className="card__text">
                        <Text className="card__title">{book.title}</Text>
                        <Text className="card__description">
                          {book.summary}
                        </Text>
                      </div>

                      <div className="card__footer">
                        {/* <div className="card__price">
                          {book.price}
                        </div> */}

                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <button
                            className="card__button"
                            onClick={() => goToBook(book)}
                          >
                            {t("readMore")}
                          </button>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "20px",
                              gap: "5px",
                            }}
                          >
                            {love[book._id] ? (
                              <img
                                src={colorimg}
                                className="icon"
                                onClick={() => islove(book._id)}
                                role="button"
                                style={{ width: "17%" }}
                                alt="love"
                              />
                            ) : (
                              <img
                                src={blackimg}
                                role="button"
                                className="icon"
                                onClick={() => islove(book._id)}
                                style={{ width: "17%" }}
                                alt="love"
                              />
                            )}
                            {save[book._id] ? (
                              <img
                                src={colorsave}
                                className="icon"
                                onClick={() => issave(book._id)}
                                role="button"
                                style={{ width: "15%" }}
                                alt="save"
                              />
                            ) : (
                              <img
                                src={blacksave}
                                role="button"
                                className="icon"
                                onClick={() => issave(book._id)}
                                style={{ width: "15%" }}
                                alt="save"
                              />
                            )}
                          </div>
                        </div>
=======

                        <button 
                          className="card__button"
                          onClick={() => goToBook(book)}
                        >
                          {t("readMore")}
                        
                        </button>
                         {save[book._id]? (<img src={blackimg} role='button' className="icon" onClick={()=>issave(book._id)}   style={{width:"30%"}} alt="love"/> ):(<img src={colorimg} className="icon" onClick={()=>issave(book._id)}    role="button" style={{width:"30%"}}  alt="love"/>)
                          }
                         
                        
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
