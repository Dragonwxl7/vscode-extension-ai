import axios from 'axios';

const GPT_URL = ''

export const chatGPT = (code:string,type?:string)=>{
  const params ={
    content:type ==='ai-explain' ? '请检查一下这段代码：' + code : code,
    source:"",
    token:"",
    temperature: 1  
  }
  return axios.post(GPT_URL,params)
}
