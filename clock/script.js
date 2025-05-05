const showClock=()=>{
    let data =new Date();
    let hours = numPadding(data.getHours());
    let minutes=numPadding(data.getMinutes());
    let second=numPadding(data.getSeconds());
    let time = hours + ":" + minutes + ":" + second
    document.getElementById("clock").innerHTML = time
}

document.addEventListener("DOMContentLoaded", ()=>{
    setInterval(showClock, 1000)
})

const numPadding = (num)=>{
    if(num < 10){
        return `${num}`.padStart(2,'0')
    }else{
        return num
    }
}