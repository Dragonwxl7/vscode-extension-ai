import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import { Button, Input, Typography, Space, Row, Col } from "antd";
// import ReactMarkdown from "react-markdown";
// import { CopyOutlined, SendOutlined } from "@ant-design/icons";
// import { Space, Input, Typography } from "@arco-design/web-react";
import { chatGPT } from "../api";
import "../chat-gpt.css";
interface chatList {
  id: string;
  question: string;
  answer: string;
}
interface ISidebarProps {}
interface Message {
  text: string;
  sender: string;
}
// 回答总计时间设为2秒
const ANSWER_TIME = 2000;
// 单字渲染时间为1毫秒
const SIMPLE_FONT_TIME = 100;
const vscode = (window as any).acquireVsCodeApi();

const Sidebar: React.FC<ISidebarProps> = () => {
  // const [fontSize, setFontSize] = useState<Number>(16);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [testText, setTestText] = useState("");
  const [currentSearchValue, setCurrentSearchValue] =
    React.useState<string>("");
  const [chatList, setChatList] = React.useState<chatList[]>([]);
  const [isCursorVisible, setIsCursorVisible] = React.useState<boolean>(true);
  const [currentAnswer, setCurrentAnswer] = React.useState<any>("");
  const [displayText, setDisplayText] = React.useState("");
  // const [loading, setLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatList]);
  React.useEffect(() => {
    if (!currentAnswer) return;
    const time =
      SIMPLE_FONT_TIME * currentAnswer.length > ANSWER_TIME
        ? Math.floor(2000 / currentAnswer.length)
        : SIMPLE_FONT_TIME;
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayText((prevText) => {
        const value = currentAnswer.charAt(i);
        i++;
        return prevText + value;
      });
      if (i === currentAnswer.length) {
        setIsCursorVisible(false);
        clearInterval(intervalId);
      }
    }, time);
    return () => clearInterval(intervalId);
  }, [currentAnswer]);

  const addChatContent = (value: string, type?: string) => {
    if (!value) return;
    const currentChatList = [...chatList];
    currentChatList.push({
      id: "12345",
      question: value,
      answer: "",
    });
    setChatList(currentChatList);
    setCurrentSearchValue("");
    setDisplayText("");
    setIsCursorVisible(true);
    chatGPT(value, type)
      .then(({ data }) => {
        console.log("data", data);
        if (data.status_code === 0 && data.data.res) {
          const message = data.data.res;
          currentChatList[currentChatList.length - 1].answer = message;
          setChatList([...currentChatList]);
          setCurrentAnswer(new String(message));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    window.addEventListener("message", providerMessageHandler);
    // return () => {
    //   window.removeEventListener("message", providerMessageHandler);
    // };
  }, []);

  /**
   * 处理 provider 发送过来的请求
   * @param event
   * @returns
   */
  const providerMessageHandler = function (event: any) {
    const data = event.data;
    const { type, code } = data;
    if (type === "ai-explain") {
      addChatContent(code.message, type);
    }
  };

  // return (
  //   <div style={{ width: 1000 }}>
  //     <GlobalStyle />
  //     {messages.map((message, index) => (
  //       <div
  //         key={index}
  //         className={`message ${message.sender === "user" ? "user" : "robot"}`}
  //       >
  //         {message.text}
  //       </div>
  //     ))}
  //     <Typography.Paragraph style={{ color: "white" }}>
  //       {testText}
  //     </Typography.Paragraph>
  //     <Row>
  //       <Col span={8}>
  //         <Input.TextArea
  //           allowClear
  //           placeholder="Please ask any code question......"
  //           autoSize={{ minRows: 2, maxRows: 20 }}
  //           style={{ width: "100%" }}
  //           onChange={handleInputChange}
  //         />
  //       </Col>
  //     </Row>
  //     <Row>
  //       <Col span={2}>
  //         <Button type="primary" icon={<CopyOutlined />}></Button>
  //       </Col>
  //       <Col span={2} offset={5}>
  //         <Button
  //           type="primary"
  //           icon={<SendOutlined />}
  //           onClick={handleSendMessage}
  //         ></Button>
  //       </Col>
  //     </Row>
  //   </div>
  // );
  return (
    <div className="chat-gpt-main">
      <div className="chatListView flex justifyCenter">
        <section className="chatList">
          {chatList.map((item, index) => {
            return (
              <div className="chatLi" key={item.id}>
                {/* 问题 */}
                <div className="chatLiContent flex justifyCenter">
                  <div className="chatLiContentDiv flex justifyCenter">
                    <svg
                      // @ts-ignore
                      t="1683278921420"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="4797"
                      width="28"
                      height="28"
                    >
                      <path
                        d="M858.5 763.6c-18.9-44.8-46.1-85-80.6-119.5-34.5-34.5-74.7-61.6-119.5-80.6-0.4-0.2-0.8-0.3-1.2-0.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-0.4 0.2-0.8 0.3-1.2 0.5-44.8 18.9-85 46-119.5 80.6-34.5 34.5-61.6 74.7-80.6 119.5C146.9 807.5 137 854 136 901.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c0.1 4.4 3.6 7.8 8 7.8h60c4.5 0 8.1-3.7 8-8.2-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"
                        p-id="4798"
                      ></path>
                    </svg>
                    <div className="contentDiv flex alignCenter">
                      <div className="questionContent">{item.question}</div>
                    </div>
                  </div>
                </div>
                {/* 回答 */}
                <div className="chatLiContent answerChatLiContent flex justifyCenter">
                  <div className="chatLiContentDiv flex justifyCenter">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAIAAAD9b0jDAAAK1WlDQ1BJQ0MgUHJvZmlsZQAASImVlwdUE9kax+/MpJPQAqFICb0J0gkgJfQASq+iEpJAQokhIQjYlcUVXAsiImBDV0UUXAsga0FEsS2KvaAbZBFQ18WCqKjsAI+wu++89877zrnn+8033/1uOffO+Q8AFG+2SJQJKwOQJcwRRwb60OMTEun4fgADIlAB1kCFzZGImOHhoQC1Kf93+3APQOP+tvV4rX9//19NlcuTcACAklBO4Uo4WSi3ou03jkicAwCyD40bLc4RjfNllNXE6ARR7h7ntEkeGueUCcZgJnKiI31R1gSAQGazxWkAkI3ROD2Xk4bWIfuhbCvkCoQoo8/Ak8Nnc1E+gfLMrKxF4yxD2RzNFwFAIaDMSPlLzbS/1U+R12ez0+Q8ua4JI/gJJKJMdv7/uTX/27IypVNjmKKNzBcHRY57dP8eZCwKkbMwZW7YFAu4E/kTzJcGxUwxR+KbOMVctl+IvG/m3NApThUEsOR1cljRU8yT+EdNsXhRpHysVLEvc4rZ4ulxpRkx8jifx5LXL+BHx01xriB27hRLMqJCpnN85XGxNFI+f54w0Gd63AD52rMkf1mvgCXvm8OPDpKvnT09f56QOV1TEi+fG5fn5z+dEyPPF+X4yMcSZYbL83mZgfK4JDdK3jcHPZzTfcPle5jODg6fYhAB7IELCAd2wCeHlzd+RoHvIlG+WJDGz6Ez0VvGo7OEHJuZdHtbewcAxu/s5DF4R5u4ixDt6nQsdTcAjufRe+I4HcsYAOCMGwBKu6djxujeKGIBaI3nSMW5k7Hx6wSwgASUgBrQAnrACJijXwV74AzcgTfwB8EgDESDBLAAcAAfZAExWAyWglWgCJSATWArqAS7wF5wEBwBx0ATOA3Og0vgGrgJ7oLHQAb6wEswBD6AUQiC8BAFokJakD5kAllB9hAD8oT8oVAoEkqAkqE0SAhJoaXQGqgEKoUqoT1QLfQTdAo6D12BuqCHUA80CL2FPsMITIbVYF3YFJ4FM2AmHAJHw/PhNDgbLoAL4Q1wBVwDH4Yb4fPwNfguLINfwsMIQBQQGmKAWCMMxBcJQxKRVESMLEeKkXKkBqlHWpAO5DYiQ14hnzA4DBVDx1hj3DFBmBgMB5ONWY5Zj6nEHMQ0YtoxtzE9mCHMNywFq4O1wrphWdh4bBp2MbYIW47djz2JvYi9i+3DfsDhcDScGc4FF4RLwKXjluDW43bgGnCtuC5cL24Yj8dr4a3wHvgwPBufgy/Cb8cfxp/D38L34T8SFAj6BHtCACGRICSsJpQTDhHOEm4R+gmjRGWiCdGNGEbkEvOJG4n7iC3EG8Q+4ihJhWRG8iBFk9JJq0gVpHrSRVI36Z2CgoKhgqtChIJAYaVChcJRhcsKPQqfyKpkS7IvOYksJW8gHyC3kh+S31EoFFOKNyWRkkPZQKmlXKA8pXxUpCraKLIUuYorFKsUGxVvKb5WIiqZKDGVFigVKJUrHVe6ofRKmahsquyrzFZerlylfEr5vvKwClXFTiVMJUtlvcohlSsqA6p4VVNVf1WuaqHqXtULqr1UhGpE9aVyqGuo+6gXqX1qODUzNZZaulqJ2hG1TrUhdVV1R/VY9Tz1KvUz6jIaQjOlsWiZtI20Y7R7tM8auhpMDZ7GOo16jVsaI5ozNL01eZrFmg2adzU/a9G1/LUytDZrNWk90cZoW2pHaC/W3ql9UfvVDLUZ7jM4M4pnHJvxSAfWsdSJ1Fmis1fnus6wrp5uoK5Id7vuBd1XejQ9b710vTK9s3qD+lR9T32Bfpn+Of0XdHU6k55Jr6C304cMdAyCDKQGeww6DUYNzQxjDFcbNhg+MSIZMYxSjcqM2oyGjPWN5xgvNa4zfmRCNGGY8E22mXSYjJiamcaZrjVtMh0w0zRjmRWY1Zl1m1PMvcyzzWvM71jgLBgWGRY7LG5awpZOlnzLKssbVrCVs5XAaodV10zsTNeZwpk1M+9bk62Z1rnWddY9NjSbUJvVNk02r2cZz0qctXlWx6xvtk62mbb7bB/bqdoF2622a7F7a29pz7Gvsr/jQHEIcFjh0OzwxtHKkee40/GBE9VpjtNapzanr84uzmLneudBF2OXZJdql/sMNUY4Yz3jsivW1cd1hetp109uzm45bsfc/nC3ds9wP+Q+MNtsNm/2vtm9HoYebI89HjJPumey525PmZeBF9urxuuZt5E313u/dz/TgpnOPMx87WPrI/Y56TPi6+a7zLfVD/EL9Cv26/RX9Y/xr/R/GmAYkBZQFzAU6BS4JLA1CBsUErQ56D5Ll8Vh1bKGgl2ClwW3h5BDokIqQ56FWoaKQ1vmwHOC52yZ0z3XZK5wblMYCGOFbQl7Em4Wnh3+cwQuIjyiKuJ5pF3k0siOKGrUwqhDUR+ifaI3Rj+OMY+RxrTFKsUmxdbGjsT5xZXGyeJnxS+Lv5agnSBIaE7EJ8Ym7k8cnuc/b+u8viSnpKKke/PN5ufNv7JAe0HmgjMLlRayFx5PxibHJR9K/sIOY9ewh1NYKdUpQxxfzjbOS643t4w7yPPglfL6Uz1SS1MH0jzStqQN8r345fxXAl9BpeBNelD6rvSRjLCMAxljmXGZDVmErOSsU0JVYYawfZHeorxFXSIrUZFIlu2WvTV7SBwi3i+BJPMlzTlqqDi6LjWXfiftyfXMrcr9uDh28fE8lTxh3vV8y/x1+f0FAQU/LsEs4SxpW2qwdNXSnmXMZXuWQ8tTlretMFpRuKJvZeDKg6tIqzJW/bLadnXp6vdr4ta0FOoWrizs/S7wu7oixSJx0f217mt3fY/5XvB95zqHddvXfSvmFl8tsS0pL/mynrP+6g92P1T8MLYhdUPnRueNOzfhNgk33dvstflgqUppQWnvljlbGsvoZcVl77cu3Hql3LF81zbSNuk2WUVoRfN24+2btn+p5FferfKpaqjWqV5XPbKDu+PWTu+d9bt0d5Xs+rxbsPvBnsA9jTWmNeV7cXtz9z7fF7uv40fGj7X7tfeX7P96QHhAdjDyYHutS23tIZ1DG+vgOmnd4OGkwzeP+B1prreu39NAayg5Co5Kj774Kfmne8dCjrUdZxyvP2Fyovok9WRxI9SY3zjUxG+SNSc0d50KPtXW4t5y8mebnw+cNjhddUb9zMazpLOFZ8fOFZwbbhW1vjqfdr63bWHb4wvxF+60R7R3Xgy5ePlSwKULHcyOc5c9Lp++4nbl1FXG1aZrztcarztdP/mL0y8nO507G2+43Gi+6XqzpWt219lbXrfO3/a7fekO6861u3Pvdt2LuffgftJ92QPug4GHmQ/fPMp9NPp4ZTe2u/iJ8pPypzpPa361+LVB5iw70+PXc/1Z1LPHvZzel79JfvvSV/ic8ry8X7+/dsB+4PRgwODNF/Ne9L0UvRx9VfS7yu/Vr81fn/jD+4/rQ/FDfW/Eb8bern+n9e7Ae8f3bcPhw08/ZH0YHSn+qPXx4CfGp47PcZ/7Rxd/wX+p+GrxteVbyLfusayxMRFbzJ6QAgja4NRUAN4eQDVxAgDUmwCQ5k1q6gmDJv8DJgj8J57U3RPmDMDelQCMy60obwB2oGyCekorAONSKNobwA4O8vYvk6Q62E/WIqOKEvtxbOydLgD4FgC+isfGRneMjX1F/xmQh6iOyZ7U8hMSphcAMwggpz2fbGtYCf5hkzr/L2v8pwfyGfzN/wmhoRTZruWjgQAAAGxlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAABygAwAEAAAAAQAAABwAAAAAF44gXQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAitJREFUSA21lTFOI0EQRWfYDQnIHGKJ3OQkxgEx0sYIlouAzUWQWS5ATGBPtPFyAGSHzkiI4XV/+09Pe2xYCZDV6un59epXdY0oiz+j4qv/dr4aGHjfAv253elxp3vc2e93utVihnL4VG3X6225pafDXv+610c3XcxZobMOHu+mMYHiW9eNTkUcPVV2h2tyTE7OBSIT9v02pW+EEr9OxKxYIOiJ6ljntkDxSABhUsugcM3aK/cn4+bQycmFeqdyIFIv7ozT1YmiFb8Z9Efxa6B4VhGJn7++FEU5fv7X3d1jf/n3Yfb6Au726JT198EhHsvlBZY8Vos5AnNqp+jwSB+53NSspKrUXXbhapRx2tTQZfDaJBL2dhYujZ9vRvXyaj09nAZU85il5dENZQ9o2AuTG7nLuwKdDm/9maJrTcswOsAGuT06QA5OXIHd1FAdWQrr7exK9VqtDZTy/iZceuN761pWQ7GjnObyiC69Cs2Tg7VRHWmVeU+vi8Lu3DUsk0D0TX1PM9VOOVU2xbs6d42GDB7HabD2rsyvWpzqZpHC5Sdr6QA4mA0NQaNG+TyDzqIuzAcGwy9CV10LnyyC0So6ZI3fVWzU6jSb0xAQJxx3AkktO3EY5wj0CjGy9NHUhlNOoXAhOHJFPAqXdkB9bG0xkBzKEVJixFLyzJHa7azSpOu2fyfSCWG6JyTr4/9BjWaD/fjVLjuegtL9x05T9Sf3jeH/ZMyHsm+BvgMNt2xrBWg/aAAAAABJRU5ErkJggg=="
                      alt=""
                      className="chat-left"
                    ></img>
                    <div className="contentDiv flex alignCenter">
                      {index !== chatList.length - 1 && (
                        <>
                          <div className="answerContent">
                            {item.answer}
                            {/* <ReactMarkdown
                              className="markdown-body"
                              children={item.answer}
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeRaw]}
                              components={{
                                code({
                                  node,
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }) {
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      children={String(children).replace(
                                        /\n$/,
                                        ""
                                      )}
                                      style={tomorrow}
                                      language={match[1]}
                                      PreTag="div"
                                      {...props}
                                    />
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            /> */}
                          </div>
                        </>
                      )}
                      {index === chatList.length - 1 && (
                        <div className="answerContent">
                          <span>
                            {displayText}
                            {/* <ReactMarkdown
                              className="markdown-body"
                              children={displayText}
                              remarkPlugins={[
                                remarkGfm,
                                remarkMath,
                                // { singleTilde: false },
                              ]}
                              rehypePlugins={[rehypeRaw]}
                              components={{
                                code({
                                  node,
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }) {
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      children={String(children).replace(
                                        /\n$/,
                                        ""
                                      )}
                                      style={tomorrow}
                                      language={match[1]}
                                      PreTag="div"
                                      {...props}
                                    />
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }} */}
                            {/* /> */}
                          </span>
                          {isCursorVisible && (
                            <span className="cursor-blink">|</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* 没有聊天记录时的展示 */}
          {chatList.length === 0 && (
            <div className="chatLiContent answerChatLiContent flex justifyCenter marginTop">
              <div className="chatLiContentDiv flex justifyCenter">
                <img
                  src="data:image/png;base64,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"
                  alt=""
                  className="chat-left"
                ></img>
                <div className="contentDiv flex alignCenter" style={{}}>
                  <div>
                    <div className="answerContent">
                      您好，我是 AI Copilot，一款基于人工智能技术的智能助手。
                    </div>
                    <div className="answerContent">
                      我能够帮助您编写 Nashornscript 和 Graaljs
                      代码，为您提供更加灵活和交互式的体验。
                    </div>
                    <div className="answerContent">
                      我拥有先进的智能算法和强大的计算能力，我将不断努力提高自己，为您提供更好的服务和支持。
                    </div>
                    <div className="answerContent">
                      如果您有任何问题或需求，欢迎随时联系我，我将竭诚为您服务。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>
      </div>
      <div className="fucView flex justifyCenter">
        <div className="formView flex justifyCenter alignCenter">
          <Input
            className="footerInput"
            placeholder="Send a message..."
            value={currentSearchValue}
            onChange={(e) => setCurrentSearchValue(e.target.value)}
            onPressEnter={(e) => addChatContent(e.currentTarget.value)}
          />
          <svg
            onClick={() => addChatContent(currentSearchValue)}
            //   @ts-ignore
            t="1683274243634"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3574"
            width="16"
            height="16"
          >
            <path
              d="M915.515273 142.819385 98.213046 458.199122c-46.058539 17.772838-44.90475 43.601756 2.348455 57.622994l197.477685 58.594874 80.292024 238.91085c10.51184 31.277988 37.972822 37.873693 61.462483 14.603752l103.584447-102.611545 204.475018 149.840224c26.565749 19.467242 53.878547 9.222132 61.049613-23.090076l149.210699-672.34491C965.264096 147.505054 946.218922 130.971848 915.515273 142.819385zM791.141174 294.834331l-348.61988 310.610267c-6.268679 5.58499-11.941557 16.652774-12.812263 24.846818l-15.390659 144.697741c-1.728128 16.24808-7.330491 16.918483-12.497501 1.344894l-67.457277-203.338603c-2.638691-7.954906 0.975968-17.705389 8.022355-21.931178l442.114555-265.181253C812.67481 268.984974 815.674251 272.975713 791.141174 294.834331z"
              p-id="3575"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

ReactDom.render(<Sidebar />, document.getElementById("root"));
