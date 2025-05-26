import {
  dayOfWeekOptions,
  LearningSlotStatusEnum,
  LearningSlotTypeEnum,
} from "@/constants/enum";
import { useAuth } from "@/providers/authProvider";
import { useLoading } from "@/providers/loadingProvider";
import { changeTimeSlot, getMeetLink } from "@/services";
import dayjs from "dayjs";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  TimePicker,
  Tooltip,
} from "antd";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IMAGES } from "@/constants/images";

type Props = {
  data: any[];
  fetchData: any;
  startDate?: string;
  endDate?: string;
};

const renderBgColor = (status: number) => {
  switch (status) {
    case 0:
      return "bg-[#1244A2]/80";
    case 1:
      return "bg-[#30e04d]/80";
    case 2:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
const Schedule: FC<Props> = ({ data, fetchData }) => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [duration, setDuration] = useState<string>("");
  const [cancel, setCancel] = useState(false);
  const [learningSlotId, setLearningSlotId] = useState<string>("");

  const generateSchedule = () => {
    const schedule: any[] = [];

    data.forEach((scheduleItem) => {
      if (!scheduleItem.timeSlots) {
        const day = dayOfWeekOptions.find(
          (d) => d.value === scheduleItem.dayOfWeek
        );
        if (day) {
          const dayIndex = dayOfWeekOptions.indexOf(day);

          if (!schedule[dayIndex]) {
            schedule[dayIndex] = [];
          }
          schedule[dayIndex].push({
            id: scheduleItem.id,
            note: scheduleItem.note,
            startTime: dayjs(scheduleItem.startTime, "HH:mm:ss").format(
              "HH:mm"
            ),
            endTime: dayjs(scheduleItem.endTime, "HH:mm:ss").format("HH:mm"),
            courseId: scheduleItem.courseId,
            slotDate: scheduleItem.slotDate,
            status: scheduleItem.status,
            type: scheduleItem.type,
            courseTitle: scheduleItem.courseTitle,
            instructorName: scheduleItem.instructor?.user.fullName,
            studentName: scheduleItem.student?.user.fullName,
          });
        }
      } else {
        scheduleItem.timeSlots.forEach((slot: any) => {
          const day = dayOfWeekOptions.find((d) => d.value === slot.dayOfWeek);
          if (day) {
            const dayIndex = dayOfWeekOptions.indexOf(day);

            if (!schedule[dayIndex]) {
              schedule[dayIndex] = [];
            }
            schedule[dayIndex].push({
              id: slot.id,
              note: scheduleItem.note,
              startTime: dayjs(slot.startTime, "HH:mm:ss").format("HH:mm"),
              endTime: dayjs(slot.endTime, "HH:mm:ss").format("HH:mm"),
              courseTitle: scheduleItem.courseTitle,
              courseId: scheduleItem.courseId,
              instructorName: scheduleItem.instructor.user.fullName,
            });
          }
        });
      }
    });

    return schedule;
  };

  useEffect(() => {
    setSchedule(generateSchedule());
  }, [data]);

  const handleGetMeetLink = async (data: any) => {
    try {
      setLoading(true);
      const res = await getMeetLink(data.id);
      if (res) window.open(res.data, "_blank");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = (item: any) => {
    setCancel(true);
    setLearningSlotId(item.id);
    const start = moment(
      `${item.slotDate.split("T")[0]} ${item.startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const end = moment(
      `${item.slotDate.split("T")[0]} ${item.endTime}`,
      "YYYY-MM-DD HH:mm"
    );

    const duration = moment.duration(end.diff(start));

    const hours = String(duration.hours()).padStart(2, "0");
    const minutes = String(duration.minutes()).padStart(2, "0");
    const seconds = String(duration.seconds()).padStart(2, "0");

    setDuration(`${hours}:${minutes}:${seconds}`);
  };

  const newStartTime = Form.useWatch("newStartTime", form);

  useEffect(() => {
    if (newStartTime && duration) {
      const [h, m] = duration.split(":").map(Number);
      const endTime = dayjs(newStartTime).add(h, "hour").add(m, "minute");
      form.setFieldsValue({ newEndTime: endTime });
    }
  }, [newStartTime, duration, form]);
  const onFinish = async (values: any) => {
    const payload = {
      ...values,
      newSlotDate: dayjs(values.newSlotDate).format("YYYY-MM-DD"),
      newStartTime: dayjs(values.newStartTime).format("HH:mm"),
      newEndTime: dayjs(values.newEndTime).format("HH:mm"),
    };
    try {
      setLoading(true);
      await changeTimeSlot(learningSlotId, payload);
      toast.success("Dời lịch học thành công");
      setCancel(false);
      form.resetFields();
      setLearningSlotId("");
      fetchData();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setCancel(false);
    form.resetFields();
    setLearningSlotId("");
  };

  return (
    <div className="overflow-x-auto py-4">
      <table className="w-full border-separate border rounded-xl text-sm text-center border-spacing-2">
        <thead>
          <tr>
            {dayOfWeekOptions.map((day) => (
              <th
                key={day.value}
                className="text-white bg-[#FDB022] rounded-xl px-4 py-2"
              >
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {dayOfWeekOptions.map((day, index) => {
              const daySchedule = schedule[index];

              return (
                <td key={day.value}>
                  {Array.isArray(daySchedule) &&
                    daySchedule.map((slot, idx) => (
                      <div
                        className={`w-full text-left border px-2 py-1 mb-2 ${renderBgColor(
                          slot.status
                        )}  text-white rounded-md`}
                      >
                        <div className="flex items-start gap-2">
                          <p>{slot.courseTitle}</p>

                          {user?.Role === "Instructor"
                            ? ((slot.slotDate &&
                                moment(slot.slotDate).isSame(
                                  moment(),
                                  "day"
                                )) ||
                                slot.status === 0) && (
                                <Popover
                                  content={
                                    <div className="flex flex-col gap-2">
                                      {slot.slotDate &&
                                        moment(slot.slotDate).isSame(
                                          moment(),
                                          "day"
                                        ) && (
                                          <div
                                            className="flex items-center cursor-pointer gap-2"
                                            onClick={() =>
                                              handleGetMeetLink(slot)
                                            }
                                          >
                                            Đi đến lớp học
                                            <img
                                              src={IMAGES.arrowRightWhite}
                                              alt="icon"
                                              className=" bg-[#1244A2] rounded-full p-0.5 ml-auto w-6  hover:scale-110 transition-all duration-200"
                                            />
                                          </div>
                                        )}
                                      {slot.status === 0 && (
                                        <div
                                          className="flex cursor-pointer items-center gap-2"
                                          onClick={() => handleCancel(slot)}
                                        >
                                          Dời lịch học
                                          <img
                                            src={IMAGES.clockIconYellow}
                                            className=" bg-[#1244A2]  rounded-full ml-auto p-0.5  w-6  hover:scale-110 transition-all duration-200"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  }
                                  placement="top"
                                >
                                  <img
                                    src={IMAGES.threeDots}
                                    alt="icon"
                                    className="w-4 h-4 cursor-pointer mt-2"
                                  />
                                </Popover>
                              )
                            : slot.slotDate &&
                              moment(slot.slotDate).isSame(moment(), "day") &&
                              slot.status === 0 && (
                                <Tooltip title="Đi đến lớp học" placement="top">
                                  <img
                                    className="cursor-pointer bg-[#1244A2] rounded-full ml-auto mt-1 p-0.5  hover:scale-110 transition-all duration-200"
                                    onClick={() => handleGetMeetLink(slot)}
                                    src={IMAGES.arrowRightWhite}
                                  />
                                </Tooltip>
                              )}
                        </div>
                        {/* <p>
                          {" "}
                          {user?.Role === "Instructor"
                            ? slot.studentName
                            : slot.instructorName}
                        </p> */}

                        <div className="text-[11px]">{slot.note}</div>
                        <div className="font-semibold text-[12px]">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className="text-[11px]">
                          {slot.slotDate
                            ? moment(slot.slotDate).format("DD-MM-YYYY")
                            : null}
                        </div>
                        <div className="text-[11px]">
                          {
                            LearningSlotTypeEnum[
                              slot.type as keyof typeof LearningSlotTypeEnum
                            ]
                          }
                        </div>
                      </div>
                    ))}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      {cancel && (
        <Modal
          title="Dời ngày học"
          open={cancel}
          onCancel={() => handleClose()}
          footer={null}
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              label="Ngày học"
              name="newSlotDate"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Vui lồng nhập ngày học",
                },
              ]}
            >
              <DatePicker
                className="w-full"
                placeholder="Ngày học"
                format="DD-MM-YYYY"
              />
            </Form.Item>
            <Form.Item
              name="newStartTime"
              rules={[
                {
                  required: true,
                  message: "Vui lồng nhập ngày học",
                },
              ]}
            >
              <TimePicker
                placeholder="Thời gian bắt đầu"
                minuteStep={30}
                format="HH:mm"
                showNow={false}
                needConfirm={false}
                disabledHours={() =>
                  Array.from({ length: 24 }, (_, i) => i).filter(
                    (hour) => hour < 8 || hour > 20
                  )
                }
              />
            </Form.Item>

            <Form.Item name="newEndTime">
              <TimePicker
                disabled
                placeholder="Thời gian kết thúc"
                format="HH:mm"
              />
            </Form.Item>

            <Form.Item
              label="Ghi chú"
              name="cancelNote"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Vui lồng nhập ghi chú",
                },
              ]}
            >
              <Input.TextArea placeholder="Ghi chú" />
            </Form.Item>
            <div className="flex justify-end">
              <Button className="mr-2" variant="outlined">
                Hủy
              </Button>
              <Button htmlType="submit" type="primary">
                Dời ngày học
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default Schedule;
