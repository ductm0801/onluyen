"use client";
import { IMAGES } from "@/constants/images";
import { db } from "@/firebase/config";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { getChat, getListChat, sendMessage } from "@/services";
import { Form } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Chat = () => {
  const [chatList, setchatList] = useState([]);
  const [activeChat, setActiveChat] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const [form] = Form.useForm();

  const fetchChatList = async () => {
    try {
      if (!user) return;
      const res = await getListChat();
      if (res) {
        setchatList(res);
      }
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách tin nhắn");
    } finally {
    }
  };

  useEffect(() => {
    fetchChatList();
  }, [user]);
  const fetchChat = async () => {
    try {
      if (!activeChat) return;
      const res = await getChat(activeChat);
      if (res) setMessages(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "chats"), () => {
      fetchChatList();
      fetchChat();
    });
  }, [activeChat]);

  const handleSubmit = async (values: any) => {
    try {
      await sendMessage({
        receiver: activeChat,
        text: values.text,
      });
    } catch (err) {
      console.log(err);
    } finally {
      form.resetFields();
    }
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="shadow-lg rounded-lg">
      <div className="flex flex-row justify-between h-[80vh] bg-white">
        <div className="flex flex-col w-2/5  border-r-2 overflow-y-auto">
          {/* <div className="border-b-2 py-4 px-2">
            <input
              type="text"
              placeholder="search chatting"
              className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
            />
          </div> */}
          {chatList.map((list: any) => (
            <div
              className={`${
                activeChat ===
                (user?.UserId === list.receiver ? list.sender : list?.receiver)
                  ? "border-blue-500 bg-blue-50/50"
                  : ""
              } flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer`}
              onClick={() =>
                setActiveChat(
                  user?.UserId === list.receiver ? list.sender : list?.receiver
                )
              }
            >
              <div className="w-1/4">
                <img
                  src={
                    user?.UserId === list.receiver
                      ? list.senderImageUrl || IMAGES.defaultAvatar
                      : list?.receiverImageUrl || IMAGES.defaultAvatar
                  }
                  className="object-cover h-12 w-12 rounded-full"
                  alt=""
                />
              </div>
              <div className="w-full">
                <div className="text-lg font-semibold">
                  {user?.UserId === list.receiver
                    ? list.senderName
                    : list?.receiverName}
                </div>
                <span className="text-gray-500 line-clamp-1">{list.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full px-5 flex flex-col justify-between">
          <div className="flex flex-col mt-5 overflow-y-auto">
            {messages.map((m: any) =>
              m.sender === user?.UserId ? (
                <div className="flex justify-end mb-4">
                  <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                    {m?.text}
                  </div>
                  <img
                    src={m.senderImageUrl || IMAGES.defaultAvatar}
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                </div>
              ) : (
                <div className="flex justify-start mb-4">
                  <img
                    src={m.senderImageUrl || IMAGES.defaultAvatar}
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                  <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                    {m?.text}
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
          <Form form={form} onFinish={handleSubmit} className="py-5 relative">
            <Form.Item name="text" noStyle>
              <input
                className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                type="text"
                placeholder="Nhập tin nhắn ở đây..."
              />
            </Form.Item>
            <Form.Item noStyle>
              <button
                type="submit"
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                <img src={IMAGES.sendIcon} alt="send" className="w-[20px]" />
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Chat);
