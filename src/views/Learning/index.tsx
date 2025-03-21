import React from "react";

const Learning = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-30px">
      <div
        className="xl:col-start-1 xl:col-span-4 aos-init aos-animate"
        data-aos="fade-up"
      >
        <ul className="accordion-container curriculum">
          <li className="accordion mb-25px overflow-hidden">
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-t-md">
              <div>
                <button className="accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
                  <span>Lesson #01</span>
                  <svg
                    className="transition-all duration-500 rotate-0"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="#212529"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="accordion-content transition-all duration-500">
                <div className="content-wrapper p-10px md:px-30px">
                  <ul>
                    <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                      <div>
                        <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                          <i className="icofont-video-alt mr-10px"></i>
                          <a
                            href="lesson.html"
                            className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                          >
                            Course Intro
                          </a>
                        </h4>
                      </div>
                      <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                        <p className="font-semibold">3.27</p>
                        <a
                          href="lesson.html"
                          className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                        >
                          <p className="px-10px">
                            <i className="icofont-eye"></i> Preview
                          </p>
                        </a>
                      </div>
                    </li>
                    <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                      <div>
                        <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                          <i className="icofont-video-alt mr-10px"></i>
                          <a
                            href="lesson-2.html"
                            className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                          >
                            Course Outline
                          </a>
                        </h4>
                      </div>
                      <div className="text-blackColor dark:text-blackColor-dark text-sm flex items-center">
                        <p className="font-semibold">5.00</p>
                        <a
                          href="lesson.html"
                          className="bg-primaryColor text-whiteColor text-sm ml-5 rounded py-0.5"
                        >
                          <p className="px-10px">
                            <i className="icofont-eye"></i> Preview
                          </p>
                        </a>
                      </div>
                    </li>
                    <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                      <div>
                        <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                          <i className="icofont-file-text mr-10px"></i>
                          <a
                            href="lesson-course-materials.html"
                            className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                          >
                            Course Materials
                          </a>
                        </h4>
                      </div>
                    </li>
                    <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                      <div>
                        <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                          <i className="icofont-audio mr-10px"></i>
                          <a
                            href="lesson-quiz.html"
                            className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                          >
                            Summer Quiz
                          </a>
                        </h4>
                      </div>
                    </li>
                    <li className="py-4 flex items-center justify-between flex-wrap">
                      <div>
                        <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                          <i className="icofont-file-text mr-10px"></i>
                          <a
                            href="lesson-assignment.html"
                            className="font-medium text-contentColor dark:text-contentColor-dark hover:text-primaryColor dark:hover;text-primaryColor"
                          >
                            Assignment
                          </a>
                        </h4>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div
        className="xl:col-start-5 xl:col-span-8 relative aos-init aos-animate"
        data-aos="fade-up"
      >
        <div>
          <div className="absolute top-0 left-0 w-full flex justify-between items-center px-5 py-10px bg-primaryColor leading-1.2 text-whiteColor">
            <h3 className="sm:text-size-22 font-bold">
              Video Content lesson 01
            </h3>
            <a href="course-details.html" className="">
              Close
            </a>
          </div>
          <div className="aspect-[16/9]">
            <iframe
              src="https://www.youtube.com/embed/vHdclsdkp28"
              allowFullScreen
              allow="autoplay"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
