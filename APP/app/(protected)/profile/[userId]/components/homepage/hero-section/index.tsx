// @flow strict
"use client";

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { RiContactsFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";
import { useState, useEffect } from "react";
import { useCurrentUser } from "../../../../../../../hooks/use-current-user";
import { AllGroups } from "@/actions/group";

function HeroSection({ profileUserId }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState("collaboration");
  const [skills, setSkills] = useState("");
  const [notification, setNotification] = useState(null);
  const session = useCurrentUser();
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState("");

  useEffect(() => {
    const loadGroups = async () => {
      if (session?.id) {
        const fetchedGroups = await AllGroups(session.id);
        setGroups(fetchedGroups);
      }
    };
    loadGroups();
  }, [session]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const connectRequest = async (e) => {
    e.preventDefault();
    const senderId = session?.id;
    if (!senderId) {
      setNotification({
        type: "error",
        message: "Error: User is not logged in.",
      });
      return;
    }

    try {
      const response = await fetch("/api/connect/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: profileUserId,
          senderId,
          message,
          purpose,
          skills,
          groupUrl: group ? `http://localhost:3000/group/${group}` : "",
        }),
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Connection request sent successfully!",
        });
      } else {
        const errorData = await response.json();
        setNotification({
          type: "error",
          message: `Failed to send request: ${
            errorData.message || "Unknown error"
          }`,
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error sending connection request.",
      });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const isOwnProfile = profileUserId === session?.id;

  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <Image
        src="/hero.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute -top-[98px] -z-10"
      />

      {/* Notification Section */}
      {notification && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-md transition duration-300 ease-in-out ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is <span className=" text-pink-500">{personalData.name}</span>
            {` , I'm a Professional `}
            <span className=" text-[#16f2b3]">{personalData.designation}</span>.
          </h1>

          <div className="my-12 flex items-center gap-5">
  {personalData.github && (
    <Link
      href={personalData.github}
      target="_blank"
      className="transition-all text-pink-500 hover:scale-125 duration-300"
    >
      <BsGithub size={35} />
    </Link>
  )}
  {personalData.linkedin && (
    <Link
      href={personalData.linkedin}
      target="_blank"
      className="transition-all text-pink-500 hover:scale-125 duration-300"
    >
      <BsLinkedin size={35} />
    </Link>
  )}
  {personalData.facebook && (
    <Link
      href={personalData.facebook}
      target="_blank"
      className="transition-all text-pink-500 hover:scale-125 duration-300"
    >
      <FaFacebook size={35} />
    </Link>
  )}
  {personalData.leetcode && (
    <Link
      href={personalData.leetcode}
      target="_blank"
      className="transition-all text-pink-500 hover:scale-125 duration-300"
    >
      <SiLeetcode size={35} />
    </Link>
  )}
  {personalData.twitter && (
    <Link
      href={personalData.twitter}
      target="_blank"
      className="transition-all text-pink-500 hover:scale-125 duration-300"
    >
      <FaTwitterSquare size={35} />
    </Link>
  )}
</div>


          <div className="flex ml-32 items-center gap-3">
            <div className="relative inline-block text-left">
              <div className="flex items-center bg-gradient-to-r to-pink-500 from-violet-600 p-[1px] rounded-full">
                {isOwnProfile ? (
                  <Link href="/settings">
                    <button
                      className="px-3 text-xs md:px-8 py-3 md:py-4 bg-gradient-to-r to-pink-500 from-violet-600 rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out md:font-semibold"
                      id="editButton"
                    >
                      EDIT PROFILE
                    </button>
                  </Link>
                ) : (
                  <>
                    <button
                      className="px-3 text-xs md:px-8 py-3 md:py-4 bg-gradient-to-r to-pink-500 from-violet-600 rounded-l-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out md:font-semibold"
                      id="connectButton"
                      onClick={handleDropdownToggle}
                    >
                      CONNECT
                    </button>
                    <div className="w-[1px] h-8 bg-white"></div>
                    <button
                      className="p-3 md:py-4 rounded-r-full border-none text-center transition-all duration-200 ease-out flex items-center justify-center"
                      onClick={handleDropdownToggle}
                    >
                      <RiContactsFill size={16} className="text-white" />
                    </button>
                  </>
                )}
              </div>

              {!isOwnProfile && isDropdownOpen && (
                <div
                  id="dropdown"
                  className="absolute right-0 z-10 mt-2 w-64 rounded-lg shadow-xl bg-gradient-to-br from-indigo-50 via-white to-indigo-100 ring-1 ring-indigo-200 ring-opacity-50 transition-transform duration-300 transform scale-95 origin-top-right"
                >
                  <div className="py-4 px-5 bg-opacity-90 rounded-lg">
                    <form
                      id="connectionForm"
                      className="p-4 bg-opacity-90 rounded-lg shadow-lg border border-gray-200 space-y-4"
                      onSubmit={connectRequest}
                    >
                      <textarea
                        id="message"
                        rows="4"
                        maxLength="300"
                        placeholder="Provide a brief description of the project..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ease-in-out text-gray-800"
                      ></textarea>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Collaboration Purpose
                        </label>
                        <select
                          id="purpose"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ease-in-out bg-white text-gray-800"
                        >
                          <option value="collaboration">
                            Open-Source Project
                          </option>
                          <option value="skill-sharing">
                            Hackathon Team
                          </option>
                          <option value="mentorship">Startup</option>
                          <option value="networking">Research</option>
                          <option value="discussion">Others</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Relevant Skills
                        </label>
                        <input
                          id="skills"
                          type="text"
                          placeholder="JavaScript, React, Node.js, etc."
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ease-in-out bg-white text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Select Group (if any)
                        </label>
                        <select
                          id="group"
                          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 ease-in-out bg-white text-gray-800"
                          onChange={(e) => setGroup(e.target.value)}
                        >
                          <option value="">No Group</option>
                          {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.grpname}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="text-right">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform duration-300 ease-in-out"
                        >
                          Send Request
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 p-3 lg:p-0 flex justify-center lg:justify-end">
          <Image
            src={personalData.image}
            alt={personalData.name}
            width={300}
            height={300}
            className="rounded-full shadow-md"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
