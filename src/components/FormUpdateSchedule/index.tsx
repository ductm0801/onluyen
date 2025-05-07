"use client";
import { IMAGES } from "@/constants/images";
import { useLoading } from "@/providers/loadingProvider";
import { createSchedule, getSchedule, updateSchedule } from "@/services";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
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
import moment from "moment";
import Schedule from "../Schedule";
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
  const [pageSize, setPageSize] = useState(100);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [scheduleId, setScheduleId] = useState<string>("");

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
        ...values,
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
  const onFinishUpdate = async (values: any) => {
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
      await updateSchedule({ ...values, timeSlotDtos }, scheduleId);
      toast.success("Cập nhật lịch học thành công");
      setUpdate(false);
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

  return (
    <div className="flex flex-col gap-4">
      {" "}
      <div className="flex items-center justify-end gap-4 mb-4">
        <div
          className="bg-[#1244A2] w-fit text-white px-3 py-2 rounded-xl font-bold cursor-pointer"
          onClick={() => setCreate(true)}
        >
          Tạo lịch học mới
        </div>
        <div
          className="bg-[#FDB022] w-fit text-white px-3 py-2 rounded-xl font-bold cursor-pointer"
          onClick={() => setUpdate(true)}
        >
          Cập nhật lịch học
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4 text-center">📅 Lịch dạy</h2>
        <Schedule data={data} fetchData={fetchData} />
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
            <Form.Item
              name="note"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="tiêu đề" />
            </Form.Item>
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
      {update && (
        <Modal
          open={update}
          title="Cập nhật lịch học"
          onCancel={() => {
            setUpdate(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
          className="rounded-lg"
        >
          <Select
            options={data.map((item: any, index) => ({
              value: item.scheduleId,
              label: item.note,
            }))}
            className="mb-4"
            placeholder="Chọn lịch học"
            onChange={(value) => {
              setScheduleId(value);
              const selectedSchedule = data.find(
                (item: any) => item.scheduleId === value
              );
              form.setFieldsValue({
                note: selectedSchedule.note,
                timeSlotDtos: selectedSchedule.timeSlots.map((slot: any) => {
                  return {
                    dayOfWeek: slot.dayOfWeek,
                    startTime: moment(slot.startTime, "HH:mm"),
                    endTime: moment(slot.endTime, "HH:mm"),
                  };
                }),
              });
            }}
          />
          <Form
            form={form}
            onFinish={onFinishUpdate}
            layout="vertical"
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
            {form.getFieldValue("timeSlotDtos")?.length > 0 && (
              <>
                <Form.Item
                  name="note"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                  <Input placeholder="tiêu đề" />
                </Form.Item>
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
                                {
                                  required: true,
                                  message: "Vui lòng chọn ngày",
                                },
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
                                minuteStep={30}
                                format="HH:mm"
                                showNow={false}
                                needConfirm={false}
                                disabledHours={() =>
                                  Array.from(
                                    { length: 24 },
                                    (_, i) => i
                                  ).filter((hour) => hour < 8 || hour > 20)
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
                                        .add(
                                          Number(duration.split(":")[0]),
                                          "hour"
                                        )
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
                      Cập nhật lịch học
                    </Button>
                  </div>
                </Form.Item>
              </>
            )}
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default FormUpdateSchedule;
