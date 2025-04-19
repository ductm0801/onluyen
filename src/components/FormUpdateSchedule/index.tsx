"use client";
import { IMAGES } from "@/constants/images";
import { useLoading } from "@/providers/loadingProvider";
import { createSchedule, getSchedule } from "@/services";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Modal,
  Select,
  Space,
  Table,
  TimePicker,
  Tooltip,
} from "antd";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Paging from "../Paging";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const dayOfWeekOptions = [
  { value: "ChuNhat", label: "Chủ nhật" },
  { value: "ThuHai", label: "Thứ hai" },
  { value: "ThuBa", label: "Thứ ba" },
  { value: "ThuTu", label: "Thứ tư" },
  { value: "ThuNam", label: "Thứ năm" },
  { value: "ThuSau", label: "Thứ sáu" },
  { value: "ThuBay", label: "Thứ bảy" },
];

type props = {
  duration: string;
};
const FormUpdateSchedule: FC<props> = ({ duration }) => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [create, setCreate] = useState(false);

  const { setLoading } = useLoading();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const timeSlotDtos = values.timeSlotDtos.map((slot: any) => {
        const start = dayjs(slot.startTime);
        const end = dayjs(slot.endTime);

        return {
          dayOfWeek: slot.dayOfWeek,
          startTime: start.format("HH:mm:ss"),
          endTime: end.format("HH:mm:ss"),
        };
      });
      await createSchedule({
        timeSlotDtos,
        courseId: params.id,
      });
      toast.success("Tạo lịch học thành công");
      setCreate(false);
      form.resetFields();
      fetchData();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const params = useParams();
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSchedule(currentPage, pageSize, params.id);
      if (res) {
        setData(res.data.items);
        setTotalItems(res.data.totalItemsCount);
        setTotalPages(res.data.totalPageCount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, params.id]);

  const convertToTime = (timeStr: string) => {
    const hour = parseInt(timeStr.split(" ")[0], 10);
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const isTimeSlotMatched = (slotStartTime: any, timeLabel: any) => {
    const slotStartHour = parseInt(slotStartTime.split(":")[0], 10);
    const slotEndHour = slotStartHour + parseInt(duration.split(":")[0], 10);

    const timeHour = parseInt(timeLabel.split(":")[0], 10);

    // Kiểm tra nếu timeLabel nằm trong khoảng thời gian học
    return timeHour >= slotStartHour && timeHour < slotEndHour;
  };

  const generateSchedule = () => {
    const schedule: any[] = [];

    // Duyệt qua từng lớp học
    data.forEach((scheduleItem) => {
      scheduleItem.timeSlots.forEach((slot: any) => {
        // Tìm ngày trong tuần tương ứng
        const day = dayOfWeekOptions.find((d) => d.value === slot.dayOfWeek);
        if (day) {
          const dayIndex = dayOfWeekOptions.indexOf(day);

          // Tạo hoặc cập nhật dữ liệu cho lịch học
          if (!schedule[dayIndex]) {
            schedule[dayIndex] = [];
          }
          schedule[dayIndex].push({
            startTime: convertToTime(slot.startTime),
            endTime: convertToTime(slot.endTime),
            courseId: scheduleItem.courseId,
          });
        }
      });
    });

    return schedule;
  };
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;
      slots.push({ startTime, endTime });
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  useEffect(() => {
    setSchedule(generateSchedule());
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      {" "}
      <div
        className="bg-[#1244A2] w-fit text-white px-3 py-2 rounded-xl font-bold cursor-pointer"
        onClick={() => setCreate(true)}
      >
        Tạo lịch học mới
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4 text-center">📅 Lịch học</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-separate text-sm text-center border-spacing-2">
            <thead>
              <tr>
                <th className=" relative bg-[#1244A2]  text-start text-[10px] rounded-xl text-white px-4 pt-3">
                  Thời gian
                  <p className="absolute inset-0 z-50 text-end px-4 pb-3 bg-[#FDB022] border border-[#FDB022] rounded-xl clip-half">
                    Ngày
                  </p>
                </th>
                {dayOfWeekOptions.map((day) => (
                  <th
                    key={day.value}
                    className=" text-white bg-[#FDB022] rounded-xl px-4 py-2"
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.startTime}>
                  <td className=" border-gray-300 py-2 font-medium bg-[#1244A2] text-white rounded-xl">
                    {timeSlot.startTime} - {timeSlot.endTime}
                  </td>
                  {dayOfWeekOptions.map((day, index) => {
                    const daySchedule = schedule[index];

                    return (
                      <td
                        key={index}
                        className={`rounded-xl border px-2 py-1 `}
                      >
                        {Array.isArray(daySchedule) &&
                          daySchedule
                            .filter((slot) =>
                              isTimeSlotMatched(
                                slot.startTime,
                                timeSlot.startTime
                              )
                            )
                            .map((slot, idx) => (
                              <div key={idx}>
                                {slot.startTime} - {slot.endTime}
                              </div>
                            ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {create && (
        <Modal
          open={create}
          title="Tạo lịch học mới"
          onCancel={() => {
            setCreate(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
          className="rounded-lg"
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              timeSlotDtos: [{}],
            }}
            onValuesChange={(changed, allValues) => {
              const updatedTimeSlots = allValues.timeSlotDtos?.map(
                (slot: any) => {
                  if (slot?.startTime) {
                    const [h, m] = duration.split(":").map(Number);
                    const endTime = dayjs(slot.startTime)
                      .add(h, "hour")
                      .add(m, "minute");
                    return { ...slot, endTime };
                  }
                  return slot;
                }
              );
              form.setFieldsValue({ timeSlotDtos: updatedTimeSlots });
            }}
          >
            <Form.List name="timeSlotDtos">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => {
                    return (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "dayOfWeek"]}
                          rules={[
                            { required: true, message: "Vui lòng chọn ngày" },
                          ]}
                        >
                          <Select
                            placeholder="Chọn ngày"
                            options={dayOfWeekOptions}
                          />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "startTime"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn thời gian bắt đầu",
                            },
                          ]}
                        >
                          <TimePicker
                            placeholder="Thời gian bắt đầu"
                            minuteStep={5}
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

                        <Form.Item shouldUpdate noStyle>
                          {({ getFieldValue }) => {
                            const startTime = getFieldValue([
                              "timeSlotDtos",
                              name,
                              "startTime",
                            ]);
                            const endTime =
                              startTime && dayjs.isDayjs(startTime)
                                ? dayjs(startTime)
                                    .add(Number(duration.split(":")[0]), "hour")
                                    .add(
                                      Number(duration.split(":")[1]),
                                      "minute"
                                    )
                                : null;

                            return (
                              <Form.Item name={[name, "endTime"]}>
                                <TimePicker
                                  value={endTime}
                                  disabled
                                  placeholder="Thời gian kết thúc"
                                />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    );
                  })}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm thời gian
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <div className="flex items-center justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-[#1244A2] rounded-lg"
                >
                  Tạo lịch học
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {/* {update && (
    <ModalUpdateLesson
      lesson={detail.current}
      onClose={handleClose}
      fetchCourseDetail={fetchCourseDetail}
    />
  )} */}
    </div>
  );
};

export default FormUpdateSchedule;
