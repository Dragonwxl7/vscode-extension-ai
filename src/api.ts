import axios from 'axios';

const GPT_URL = 'https://frontend.myhexin.com/kingfisher/robot/homeworkChat'

export const chatGPT = (code:string,type?:string)=>{
  const params ={
    content:type ==='ai-explain' ? '请检查一下这段代码：' + code : code,
    source:"homework-47-wangxiaolong",
    token:"610EE45BF-Qtc2VydmU=",
    temperature: 1  
  }
  return axios.post(GPT_URL,params)
}