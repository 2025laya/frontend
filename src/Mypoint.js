
import { useState, useEffect } from "react";
import start from './images/star.png'
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
export default function Mypoint() {
  const { t } = useTranslation();
  const font = i18n.language === "ar" ? 
  "elmesriRegular, sans-serif" :
   i18n.language==="zh" || i18n.language==="ja" ? "zheng":
    i18n.language==="ko"?"Dongle" :
     "playpen, sans-serif";
  const [points,setpoints]=useState(0);
  useEffect(()=>{
    const userid=localStorage.getItem("userid");
    if(!userid){
      console.log("لم يتم ايجاد معرف المستخدم");
      return;
    }
    fetch('http://localhost:3000/api/gamification/leaderboard')
    .then(Response=>Response.json())
    .then(users=>{
      const currentUser=users.find(user=>user._id===userid);
      
      if(currentUser){
      setpoints(currentUser.points);
      console.log("ok",currentUser.points);
    }
    else{
      console.log("المستخدم ليس في قائمة العشرة الاوائل ");
      setpoints(0);
    }
  }
    )
    .catch(error=>console.error("حدث أ في الاتصال",error))
  },[])
  return (
    
      <div  style={{ padding: "30px",backgroundColor:"#ffffff80",borderRadius:"25px",height:"50%", width:"50%"}}>
        <img src={start} alt="start" style={{width:"25%"}}/> 
        <p style={{ fontFamily:font}}>{t("totalPoints")}:</p>
      <p>{points}</p>
      </div>
  
  
  );
}

