import React,{ useState , useEffect } from "react";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import"./TheBook.css";
import Text from "./Text.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
export default function TheBook({ setpage,
  selectedBook,
  state,
     }) {
  
  const { t } = useTranslation();
  const [bookComments , setBookComments]=useState([]);
    function goToHome() {
    setpage("home");
  }

  function goToNote() {
    setpage("notesAboutUs");
  }
async function editComment(id, oldRating, oldText) {

  const newRating = Number(
    prompt(t("numStars"), oldRating)
  );


  if (
    isNaN(newRating) ||
    newRating < 1 ||
    newRating > 5
  ) {
    alert(t("enter"));
    return;
  }


  const newText = prompt(
    t("writeReasonHere"),
    oldText
  );


  if (newText === null) return;


  try {

    await fetch(
      `http://localhost:3000/api/comments/${id}`,
      {
        method:"PUT",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          text:newText.trim(),

          rating:newRating

        })
      }
    );


    setBookComments(
      bookComments.map(comment =>
        comment.id === id
        ?
        {
          ...comment,
          text:newText.trim(),
          rating:newRating
        }
        :
        comment
      )
    );


  } catch(err){

    console.log(err);

  }

}


async function deleteComment(id) {

  try {


    await fetch(
      `http://localhost:3000/api/comments/${id}`,
      {
        method:"DELETE"
      }
    );


    setBookComments(
      bookComments.filter(
        comment => comment.id !== id
      )
    );


  } catch(err){

    console.log(err);

  }

}
useEffect(() => {

  if (!selectedBook) return;

  fetch(`http://localhost:3000/api/books/${selectedBook.id}/comments`)
    .then(res => res.json())
    .then(data => {
      setBookComments(data);
    })
    .catch(err => {
      console.log("Error loading comments:", err);
    });

}, [selectedBook]);
  if (!selectedBook) {
    console.log(selectedBook);
    return  <div style={{ display: "flex", flexDirection: "column" }}>
            <h5 style={{ fontFamily: "playpen" ,margin:"0"}}>
              <span
                style={{
                  color: "#b422a0",
                  fontSize: "40px",
                  marginRight: "170px",
                  display: "inline-block",
                  marginBottom: "20px",
                }}
              >
                {t("oops")}
              </span>{" "}
              <br></br>{t("noResultsFound")}
            </h5>
            <div style={{display:"flex"}}>

            <button onClick={goToHome} style={{paddingLeft:"10px", paddingRight:"10px",backgroundColor: "#b422a0",border: "none",borderRadius:"25px",boxShadow:" 0px 2px 7px 0px #17153a",marginTop:"27px" }}> {t("but2")}</button>
            </div>
           
          </div>;
  }
  // const data = Array.isArray(bookComments) ? [...bookComments].reverse() : [];
   const data = Array.isArray(bookComments)
    ? bookComments
        .filter(
          (comment) =>
            comment.addedBy === selectedBook.id
        )
        .reverse()
    : [];
        return (
           <div style={{padding:"2%",minHeight:"100vh" , display:"flex" , justifyContent:"center" , flexDirection:"column" , gap:"100px"}}>
             <div className="book-card" style={{backgroundColor:state?"#2a274d":"#ffffff"}}>
                <div className="book-left">
                   <Text className="book-title" style={{color:state?"#fff":"#27272a"}}>{selectedBook.title}</Text>
                  
                      <div className="card223">
                          <img className="book-cover" src={selectedBook.cover} alt={selectedBook.title} />
                      </div>
    
                   {selectedBook.isbn && (
                        <div className="book-qr">
                              <QRCodeCanvas value={selectedBook.isbn} size={150} level="H" />
                        </div>
                    )}
                     {selectedBook.pdf && (
                               <button className="Btn book-pdf">
                                      <span className="svgContainer">
                                           📄
                                      </span>
                                      <div className="textContainer">
                                            <a href={selectedBook.pdf} target="_blank" rel="noreferrer">
                                              <Text>
                                                  {t("openPdf")}
                                              </Text>  
                                            </a>
                                      </div>
                               </button>
                          )}
                </div>
                <div className="book-divider" style={{backgroundColor:state?"#120E2E":"#ff00bb"}}></div>
                  <div className="book-right">
                    <div className="error-alert" style={{backgroundColor:state?"#dcdeef":"#232531"}}>
                        <div className="error-content">
                             <div style={{display: "flex", flexDirection:"column", justifyContent:"start", alignItems: "start"}}>
                                 <Text style={{color:state?"#000":"#ffffff"}}>{t("author")} :</Text>
                                 <Text style={{color:state?"rgb(0,0,0,0.5)":"rgb(255,255,255,0.5)"}}>{selectedBook.author}</Text>
                             </div>
                        </div>
                    </div>
                    <div className="error-alert" style={{backgroundColor:state?"#dcdeef":"#232531"}}>
                        <div className="error-content">
                              <div style={{display: "flex", flexDirection:"column", justifyContent:"start", alignItems: "start"}}>
                                 <Text style={{color:state?"#000":"#ffffff"}}>{t("category")} :</Text>
                                 <Text style={{color:state?"rgb(0,0,0,0.5)":"rgb(255,255,255,0.5)"}}>{selectedBook.category}</Text>
                              </div>
                        </div>
                    </div>
                    <div className="error-alert" style={{backgroundColor:state?"#dcdeef":"#232531"}}>
                        <div className="error-content">
                            <div style={{display: "flex", flexDirection:"column", justifyContent:"start", alignItems: "start"}}>
                                 <Text style={{color:state?"#000":"#ffffff"}}>{t("description")} :</Text>
                                 <Text style={{color:state?"rgb(0,0,0,0.5)":"rgb(255,255,255,0.5)"}}>{selectedBook.description}</Text>
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:"30px"}}>
                         
                          {selectedBook.audio && (
                                <div className="book-audio" style={{backgroundColor:state?"#dcdeef":"#232531"}}> 
                                <div style={{display:"flex", alignItems:"center" , gap:"5%"}}>
                                       <Text style={{color:state?"#000":"#ffffff"}}>
                                         {t("audio")} :
                                       </Text>
                                      <Text style={{color:state?"rgb(0,0,0,0.5)":"rgb(255,255,255,0.5)"}}>
                                         {selectedBook.title}
                                      </Text>
                                   
                                </div>
                                   
                                    <audio controls >
                                        <source src={selectedBook.audio} type="audio/mpeg" />
                                              Your browser does not support audio.
                                    </audio>
                                </div>
                          )}
                      
                            <Text className="back-btn" onClick={goToHome} style={{backgroundColor:state?"#120E2E":"#b422a0"}}>
                                {t("but2")}
                          </Text>
                      
                          
                      </div>
                </div>
             </div>
             <div>
              <div style={{display:"flex",justifyContent:"space-between",paddingLeft:"3%",paddingRight:"5%",alignItems:"center",marginBottom:"50px"}}>
                   <Text style={{fontSize:"30px",color:state?"#ffffff":"#000"}}>
                     Notes about us :
                   </Text>
                   <Text style={{fontSize:"20px",color:state?"#ffffff":"#000"}} onClick={goToNote}>
                    write your note here 
                   </Text>
              </div>
             
             <div className="book-card1" style={{backgroundColor:state?"#2a274d":"#ffffff"}}>
             

        <div
          style={{
            display:"flex",
            flexDirection:"column",
            gap:"15px",
            maxHeight:"500px",
            overflowY:"auto",
            padding:"20px"
          }}
        >


   {data.map((c)=> (

          <div
            key={c.id}
            className="comment-card1"
            style={{
              width:"100%",
              padding:"15px",
              borderRadius:"10px",
            backgroundColor:state?"#dcdeef":"white",
            }}
          >

            <div
              style={{
                display:"flex",
                justifyContent:"space-between"
              }}
            >


              <div>

                {
                  c.text &&
                  <Text>
                    {c.text}
                  </Text>
                }


                <p>
                  {"⭐️".repeat(Number(c.rating))}
                </p>


              </div>



              <select

    // style={{
    //   position: "absolute",
    //   top: 0,
    //   left: 0,
    //   width: "30px",
    //   height: "30px",
    //   opacity: 0,
    //   cursor: "pointer",
    //   zIndex: 2,
    //   borderStyle:"none"
    // }}
               
                defaultValue=""

                onChange={(e)=>{


                  if(e.target.value==="edit"){

                    editComment(
                      c.id,
                      c.rating,
                      c.text
                    );

                  }


                  if(e.target.value==="delete"){

                    deleteComment(
                      c.id
                    );

                  }


                  e.target.value="";


                }}

              >

                <option value="" >
                  {t("menu")}
                </option>


                <option value="edit">
                  {t("edit1")}
                </option>


                <option value="delete">
                  {t("delete")}
                </option>


              </select>

<FontAwesomeIcon
    icon={faEllipsisVertical}
    style={{
      fontSize: "20px",
      color: "#1E1B4B",
      pointerEvents: "none",
    }}
  />

            </div>


          </div>


        ))}



</div>

             </div>
             </div>
           </div>
   
  );}