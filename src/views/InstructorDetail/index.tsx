"use client";
import { IMAGES } from "@/constants/images";
import { db } from "@/firebase/config";
import { getChat, sendMessageToInstructor } from "@/services";
import { Form } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useAuth } from "@/providers/authProvider";

const InstructorDetail = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const params = useParams();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const fetchChat = async () => {
    try {
      const res = await getChat(params.id);
      if (res) setMessages(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "chats"), (snapshot) => {
      fetchChat();
    });
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      await sendMessageToInstructor({ receiver: params.id, text: values.text });
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
    <div>
      InstructorDetail
      {open ? (
        <div className="w-[400px] aspect-[3/2] flex flex-col rounded-t-lg bg-white border fixed bottom-0 right-10 ">
          <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <div>Đặt câu hỏi cho</div>
            <div onClick={() => setOpen(false)} className="cursor-pointer">
              &times;
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2 overflow-y-auto h-[300px]">
            {messages.map((m, index) =>
              m.sender === user?.UserId ? (
                <div className="flex justify-end mb-4">
                  <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                    {m?.text}
                  </div>
                  <img
                    src={IMAGES.defaultAvatar}
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                </div>
              ) : (
                <div className="flex justify-start mb-4">
                  <img
                    src={IMAGES.defaultAvatar}
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

          <Form
            form={form}
            onFinish={handleSubmit}
            className="flex justify-between gap-2 mt-auto p-4 border-t"
          >
            <Form.Item noStyle name="text">
              <input
                type="text"
                placeholder="Nhập nội dung chat"
                className="w-full px-4 py-2 border rounded-md"
              />
            </Form.Item>
            <Form.Item noStyle>
              <button
                className="text-white bg-blue-600 border px-3 rounded-lg"
                type="submit"
              >
                Gửi
              </button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <img
          src={IMAGES.chatIcon}
          alt="chat"
          className="fixed bottom-10 right-10 w-[40px]"
          onClick={() => setOpen(true)}
        />
      )}
    </div>
  );
};

export default InstructorDetail;
