"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Tabs,
  Tab,
  Card,
  ProgressBar,
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { motion } from "framer-motion";
import _, { tap } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Spline from "@splinetool/react-spline";
import data from "./userstats.json";
import ModeSelectionButton from "./_components/ModeSelectionButton";

const MandarinDashboard = () => {
  // Parse the JSON data
  const [sessions, setSessions] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wordMetrics, setWordMetrics] = useState({});
  const [wordHistory, setWordHistory] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const router = useRouter();
  const [showRouterModal, setShowRouterModal] = useState(false);

  const handleTap = () => {
    console.log("clicking");
    setShowRouterModal(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }

    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);
    }
  }, []);

  useEffect(() => {
    // const styleElement = document.createElement("style");
    // styleElement.innerHTML = darkThemeStyles;
    // document.head.appendChild(styleElement);
    // In a real app, you would fetch this data

    setSessions(data);

    // Process word data for word cloud and metrics
    const allWords = {};
    const wordTimeHistory = {};

    data.forEach((session, sessionIndex) => {
      const sessionDate = new Date(session.Offset / 10000).toLocaleDateString();
      const words = session.NBest[0].Words;

      words.forEach((word) => {
        if (!allWords[word.Word]) {
          allWords[word.Word] = {
            count: 0,
            accuracyScores: [],
            fluencyScores: [],
            toneAccuracy: [],
            stressPatterns: [],
            speedWPM: [],
          };
        }

        allWords[word.Word].count += 1;
        allWords[word.Word].accuracyScores.push(
          word.PronunciationAssessment?.AccuracyScore || 0
        );

        // Generate some simulated metrics that might not be in the original data
        const toneAccuracy =
          (word.PronunciationAssessment?.AccuracyScore || 0) + 15 - 5;
        const fluencyScore =
          session.NBest[0].PronunciationAssessment?.FluencyScore || 0;
        const stressPattern = fluencyScore + 20 - 10;

        const speedWPM = 60 + 40;

        allWords[word.Word].toneAccuracy.push(toneAccuracy);
        allWords[word.Word].fluencyScores.push(fluencyScore);
        allWords[word.Word].stressPatterns.push(stressPattern);
        allWords[word.Word].speedWPM.push(speedWPM);

        // Track word history over time
        if (!wordTimeHistory[word.Word]) {
          wordTimeHistory[word.Word] = [];
        }

        wordTimeHistory[word.Word].push({
          session: sessionIndex + 1,
          date: sessionDate,
          accuracyScore: word.PronunciationAssessment?.AccuracyScore || 0,
          toneAccuracy: toneAccuracy,
          fluencyScore: fluencyScore,
          stressPattern: stressPattern,
          speedWPM: speedWPM,
        });
      });
    });

    // Process metrics for each word
    const processedWordMetrics = {};
    Object.keys(allWords).forEach((word) => {
      const metrics = allWords[word];
      processedWordMetrics[word] = {
        count: metrics.count,
        avgAccuracy: _.mean(metrics.accuracyScores).toFixed(1),
        avgToneAccuracy: _.mean(metrics.toneAccuracy).toFixed(1),
        avgFluency: _.mean(metrics.fluencyScores).toFixed(1),
        avgStressPattern: _.mean(metrics.stressPatterns).toFixed(1),
        avgSpeedWPM: _.mean(metrics.speedWPM).toFixed(1),
        improvementRate: (
          ((_.last(metrics.accuracyScores) - _.first(metrics.accuracyScores)) /
            _.first(metrics.accuracyScores)) *
          100
        ).toFixed(1),
        history: wordTimeHistory[word],
      };
    });

    setWordMetrics(processedWordMetrics);
  }, []);

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setWordHistory(wordMetrics[word]?.history || []);
    setShowModal(true);
  };

  // Calculate overall practice metrics
  const calculatePracticeMetrics = () => {
    if (!sessions.length) return null;

    const totalSpeakingTimeMs = _.sumBy(sessions, "Duration");
    const totalSpeakingTimeMin = (totalSpeakingTimeMs / 60000000).toFixed(2);
    const avgSessionLengthMin = (
      totalSpeakingTimeMs /
      sessions.length /
      60000000
    ).toFixed(2);

    // Simulate consistency streak (would be calculated from actual dates in a real app)
    const consistencyStreak = 4;

    // Simulated peak learning times
    const peakLearningTimes = [
      { hour: "8-10 AM", sessions: 5 },
      { hour: "12-2 PM", sessions: 3 },
      { hour: "6-8 PM", sessions: 8 },
      { hour: "8-10 PM", sessions: 6 },
    ];

    return {
      totalSpeakingTimeMin,
      avgSessionLengthMin,
      consistencyStreak,
      peakLearningTimes,
    };
  };

  const practiceMetrics = calculatePracticeMetrics();

  // Prepare Word Cloud data
  const wordCloudData = Object.keys(wordMetrics).map((word) => ({
    text: word,
    value: wordMetrics[word].count * 10,
    accuracy: wordMetrics[word].avgAccuracy,
  }));

  // Get Bootstrap color classes based on accuracy score
  const getScoreColor = (score) => {
    if (score >= 85) return "success";
    if (score >= 70) return "info";
    if (score >= 50) return "warning";
    return "danger";
  };

  // Get RGB values for glow effects
  const getGlowColorRGB = (score) => {
    if (score >= 85) return "40, 167, 69"; // success
    if (score >= 70) return "23, 162, 184"; // info
    if (score >= 50) return "255, 193, 7"; // warning
    return "220, 53, 69"; // danger
  };

  // Modal content for word details
  const renderWordModal = () => {
    if (!selectedWord || !wordMetrics[selectedWord]) return null;

    const metrics = wordMetrics[selectedWord];
    const history = metrics.history || [];

    const chartData = history.map((entry, index) => ({
      session: `Session ${entry.session}`,
      accuracyScore: entry.accuracyScore,
      toneAccuracy: entry.toneAccuracy,
      fluencyScore: entry.fluencyScore,
      stressPattern: entry.stressPattern,
      speedWPM: entry.speedWPM,
    }));

    return (
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{selectedWord} - Pronunciation Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="progress"
            id="word-metrics-tabs"
            className="mb-3"
          >
            <Tab eventKey="progress" title="Progress Over Time">
              <div className="mb-4">
                <h5>Pronunciation Metrics Over Time</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="accuracyScore"
                      stroke="#8884d8"
                      name="Accuracy Score"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="toneAccuracy"
                      stroke="#82ca9d"
                      name="Tone Accuracy"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="fluencyScore"
                      stroke="#ffc658"
                      name="Fluency Score"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="stressPattern"
                      stroke="#ff8042"
                      name="Stress Pattern"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h5>Speech Speed (Words Per Minute)</h5>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis domain={[0, 120]} />
                    <Tooltip />
                    <Bar
                      dataKey="speedWPM"
                      fill="#3498db"
                      name="Words Per Minute"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Tab>

            <Tab eventKey="metrics" title="Current Metrics">
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <h5 className="text-center mb-4">
                        Overall Pronunciation Score
                      </h5>
                      <div className="text-center">
                        <div
                          style={{
                            position: "relative",
                            width: "150px",
                            height: "150px",
                            margin: "0 auto",
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                              innerRadius="60%"
                              outerRadius="100%"
                              data={[
                                { name: "score", value: metrics.avgAccuracy },
                              ]}
                              startAngle={90}
                              endAngle={-270}
                            >
                              <RadialBar
                                minAngle={15}
                                background
                                clockWise
                                dataKey="value"
                                fill={`var(--bs-${getScoreColor(
                                  metrics.avgAccuracy
                                )})`}
                              />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            {metrics.avgAccuracy}%
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <h5 className="text-center mb-3">Improvement Rate</h5>
                      <div className="text-center mb-3">
                        <span
                          className={`fs-1 fw-bold ${
                            metrics.improvementRate > 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {metrics.improvementRate > 0 ? "+" : ""}
                          {metrics.improvementRate}%
                        </span>
                      </div>
                      <p className="text-center text-muted">
                        From first to last session
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Detailed Metrics</h5>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Tone Accuracy</span>
                      <span className="fw-bold">
                        {metrics.avgToneAccuracy}%
                      </span>
                    </div>
                    <ProgressBar
                      now={metrics.avgToneAccuracy}
                      variant={getScoreColor(metrics.avgToneAccuracy)}
                      className="mb-2"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Fluency Score</span>
                      <span className="fw-bold">{metrics.avgFluency}%</span>
                    </div>
                    <ProgressBar
                      now={metrics.avgFluency}
                      variant={getScoreColor(metrics.avgFluency)}
                      className="mb-2"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Word Stress & Intonation</span>
                      <span className="fw-bold">
                        {metrics.avgStressPattern}%
                      </span>
                    </div>
                    <ProgressBar
                      now={metrics.avgStressPattern}
                      variant={getScoreColor(metrics.avgStressPattern)}
                      className="mb-2"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Speech Speed</span>
                      <span className="fw-bold">{metrics.avgSpeedWPM} WPM</span>
                    </div>
                    <ProgressBar
                      now={(metrics.avgSpeedWPM / 120) * 100}
                      variant="info"
                      className="mb-2"
                    />
                    <b className="text-muted">
                      Optimal range: 70-90 WPM for beginners
                    </b>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="tips" title="Improvement Tips">
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5>Personalized Recommendations</h5>
                  <ul className="list-group list-group-flush">
                    {metrics.avgToneAccuracy < 75 && (
                      <li className="list-group-item">
                        <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                        <strong>Tone Practice:</strong> Focus on the tonal
                        changes in "{selectedWord}". Try practicing with a
                        native speaker.
                      </li>
                    )}
                    {metrics.avgFluency < 60 && (
                      <li className="list-group-item">
                        <i className="bi bi-mic-fill text-primary me-2"></i>
                        <strong>Fluency Improvement:</strong> Record yourself
                        saying "{selectedWord}" in complete sentences to improve
                        natural flow.
                      </li>
                    )}
                    {metrics.avgStressPattern < 70 && (
                      <li className="list-group-item">
                        <i className="bi bi-music-note-beamed text-info me-2"></i>
                        <strong>Stress Pattern:</strong> Practice stressing the
                        correct syllables in "{selectedWord}". Listen to native
                        examples.
                      </li>
                    )}
                    {(metrics.avgSpeedWPM < 70 || metrics.avgSpeedWPM > 90) && (
                      <li className="list-group-item">
                        <i className="bi bi-speedometer text-danger me-2"></i>
                        <strong>Speech Pace:</strong> Your speed is{" "}
                        {metrics.avgSpeedWPM < 70 ? "slower" : "faster"} than
                        optimal. Practice speaking{" "}
                        {metrics.avgSpeedWPM < 70
                          ? "more quickly"
                          : "more slowly"}
                        .
                      </li>
                    )}
                    <li className="list-group-item">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <strong>Regular Practice:</strong> Continue practicing "
                      {selectedWord}" in different contexts to reinforce
                      learning.
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              <div className="alert alert-info">
                <h6 className="alert-heading">
                  <i className="bi bi-lightbulb-fill me-2"></i>Pro Tip
                </h6>
                <p className="mb-0">
                  Try shadow speaking with native audio to improve your
                  pronunciation of "{selectedWord}".
                </p>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const getColorByIndex = (index) => {
    const colors = ["#037ca6", "#0375e1", "#035b87", "#1e7598", "#52bdc9"];
    return colors[index % colors.length];
  };

  return (
    <div
    // initial={{ opacity: 0 }}
    // animate={{ opacity: 1 }}
    // transition={{ duration: 0.5 }}
    >
      <Container
        fluid
        className="py-4 bg-light min-vh-100"
        style={{
          backgroundImage: 'url("/pattern-randomized.svg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" /> */}

        {/* Dashboard Header */}

        <div
          className="dashboard-header mb-5 overflow-hidden rounded-4 shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Row className="g-0">
            {/* Left panel with gradient background and 3D elements */}
            <Col
              md={6}
              className="p-5 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #FF9671 0%, #FFC75F 100%)",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.1)",
              }}
            >
              {/* Animated floating circles */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="position-absolute rounded-circle"
                  style={{
                    top: `${80}%`,
                    left: `${80}%`,
                    width: `${40 + 20}px`,
                    height: `${40 + 20}px`,
                    background: `rgba(255, 255, 255, ${0.3 + 0.1})`,
                    zIndex: 0,
                  }}
                  animate={{
                    y: [0, 30 - 15, 0],
                    x: [0, 30 - 15, 0],
                    scale: [1, 0.5 + 0.8, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8 + 4,
                    ease: "easeInOut",
                  }}
                />
              ))}

              <div className="position-relative z-1 d-flex flex-column justify-content-center align-items-start h-100">
                {/* Background Chinese characters with animated glow effect */}
                <div
                  className="position-absolute"
                  style={{
                    top: "5%",
                    left: "5%",
                    fontSize: "18rem",
                    fontWeight: "bold",
                    fontFamily: "'Noto Serif SC', serif",
                    zIndex: -110,
                    color: "rgba(255, 255, 255, 0.15)",
                    filter: "blur(2px)",
                  }}
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,60,0,0)",
                      "0 0 40px rgba(255,60,0,0.3)",
                      "0 0 20px rgba(255,60,0,0)",
                    ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  小球
                </div>

                <div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                  className="text-end"
                >
                  <h1
                    className="mb-1 display-3 fw-bold"
                    style={{
                      color: "#FFFFFF",
                      textShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      letterSpacing: "-1px",
                    }}
                  >
                    <span style={{ color: "#5F4B8B" }}>Xiao</span>Qiu
                  </h1>

                  <div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    style={{
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #5F4B8B, transparent)",
                      marginBottom: "10px",
                    }}
                  />

                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mb-4 fw-light"
                    style={{
                      color: "#5F4B8B",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                    }}
                  >
                    Dashboard
                  </motion.h4>
                </div>

                <div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="mt-3 text-start"
                >
                  <p
                    className="lead mb-0"
                    style={{
                      color: "#5F4B8B",
                      fontSize: "1.5rem",
                      fontStyle: "italic",
                    }}
                  >
                    Your personalized dashboard for tracking
                    <br />
                    pronunciation progress and practice habits
                  </p>

                  <ModeSelectionButton />
                </div>
              </div>
            </Col>

            {/* Right panel with glass morphism stats */}
            <Col
              md={6}
              className="p-0 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #42047E 0%, #07F2F2 100%)",
              }}
            >
              {/* Animated wave background */}
              <svg
                className="position-absolute w-100 h-100"
                style={{ top: 0, left: 0, zIndex: 0, opacity: 0.2 }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <motion.path
                  fill="rgba(255,255,255,0.2)"
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>

              <div className="p-4 pt-4 position-relative z-1000">
                <div
                  className="text-white text-end mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h4 className="mb-0 fw-bold">Welcome back William!</h4>
                  <p className="small mb-0 opacity-75">Keep up the good work</p>
                </div>

                <div
                  className="d-flex flex-column"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {/* Stats with cascading reveal animation */}
                  {[
                    { label: "Most Improved", value: "78%", width: "90%" },
                    {
                      label: "Total Practice (mins)",
                      value: "120",
                      width: "80%",
                    },
                    { label: "Last Session (days)", value: "1", width: "70%" },
                    {
                      label: "Top Word",
                      value: "你好",
                      width: "60%",
                      isChinese: true,
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="stat-card mb-3 ms-auto"
                      style={{ width: stat.width }}
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.7,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <div
                        className="d-flex justify-content-between align-items-center p-3 rounded-3"
                        style={{
                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "36px",
                              height: "36px",
                              background: getColorByIndex(index),
                            }}
                          >
                            <i></i>
                          </div>
                          <span
                            className="text-white"
                            style={{ fontSize: "14px", fontWeight: 500 }}
                          >
                            {stat.label}
                          </span>
                        </div>
                        <motion.span
                          className="text-white fw-bold"
                          style={{
                            fontSize: "2.5rem",
                            lineHeight: 1,
                            fontFamily: stat.isChinese
                              ? "'Noto Serif SC', serif"
                              : "inherit",
                          }}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 1.0 + index * 0.15,
                            type: "spring",
                          }}
                        >
                          {stat.value}
                        </motion.span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div
          className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="text-white text-3xl" style={{ zIndex: 100000 }}></div>
          {/* Speech Bubble Attached to Sphere */}
        </div>
        {/* Decorative floating elements */}
        <div
          className="decorative-elements"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              initial={{
                x: windowWidth,
                y: windowHeight,
                scale: 0.5 + 0.5,
                rotate: 360,
              }}
              animate={{
                y: [windowHeight, windowHeight, windowHeight],
                x: [windowWidth, windowWidth, windowWidth],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 60 + 60,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                // position: "absolute",
                width: 100 + 50,
                height: 100 + 50,
                borderRadius: "50%",
                background: `rgba(255, 255, 255, 0.05)`,
                filter: "blur(20px)",
              }}
            />
          ))}
        </div>
        <Row className="mb-4">
          <Col>
            <div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg border-light">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">Speaking & Pronunciation Metrics</h4>
                </Card.Header>
                <Card.Body>
                  <div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <div
                      className="alert alert-info d-flex align-items-center"
                      role="alert"
                    >
                      <i className="bi bi-info-circle-fill me-2 fs-4"></i>
                      <div>
                        <strong>Pro Tip:</strong> Click on any word to see
                        detailed metrics and progress over time. Regular
                        practice of challenging words can increase your fluency
                        by 35%!
                      </div>
                    </div>
                  </div>
                  <Row>
                    {Object.keys(wordMetrics).map((word, index) => {
                      const metrics = wordMetrics[word];
                      const scoreColor = getScoreColor(metrics.avgAccuracy);

                      return (
                        <Col key={index} md={2} sm={4} className="mb-3">
                          <div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.01 * index,
                              type: "spring",
                              stiffness: 200,
                              damping: 20,
                            }}
                          >
                            <Card
                              className="h-20 word-card shadow"
                              onClick={() => handleWordClick(word)}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                border: `1px solid var(--bs-${scoreColor})`,
                                backgroundColor: "#fff",
                              }}
                            >
                              <Card.Body className="text-center">
                                <h4 className="mb-2">{word}</h4>
                                <div
                                  className="d-flex justify-content-center align-items-center mb-2"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.3 + 0.1 * index,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "70px",
                                      height: "70px",
                                      borderRadius: "50%",
                                      backgroundColor: `var(--bs-${scoreColor})`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "white",
                                      fontWeight: "bold",
                                      fontSize: "15px",
                                      boxShadow: `0 0 10px rgba(var(--bs-${scoreColor}-rgb), 0.5)`,
                                    }}
                                  >
                                    {metrics.avgAccuracy}%
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <b className="text-muted d-block">
                                    Practice count: {metrics.count}
                                  </b>
                                  <b className="text-muted d-block">
                                    Improvement:
                                    <span
                                      className={
                                        metrics.improvementRate > 0
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {metrics.improvementRate > 0 ? " +" : " "}
                                      {metrics.improvementRate}%
                                    </span>
                                  </b>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              // delay={0.4}
            >
              <Card className="shadow-lg h-100 border-light">
                <Card.Header className="bg-success text-white">
                  <h4 className="mb-0">Engagement & Practice Habits</h4>
                </Card.Header>
                <Card.Body>
                  {practiceMetrics && (
                    <Row>
                      <Col sm={6} className="mb-4">
                        <div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <Card className="h-100 border-0 shadow-sm bg-white">
                            <Card.Body className="text-center">
                              <h6 className="text-muted">
                                Total Speaking Time
                              </h6>
                              <motion.h2
                                className="text-success mb-0"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15,
                                  delay: 0.7,
                                }}
                              >
                                {practiceMetrics.totalSpeakingTimeMin} min
                              </motion.h2>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>

                      <Col sm={6} className="mb-4">
                        <div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                        >
                          <Card className="h-100 border-0 shadow-sm bg-white">
                            <Card.Body className="text-center">
                              <h6 className="text-muted">
                                Avg. Session Length
                              </h6>
                              <motion.h2
                                className="text-primary mb-0"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15,
                                  delay: 0.8,
                                }}
                              >
                                {practiceMetrics.avgSessionLengthMin} min
                              </motion.h2>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>

                      <Col sm={6} className="mb-4">
                        <div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                        >
                          <Card className="h-100 border-0 shadow-sm bg-white">
                            <Card.Body className="text-center">
                              <h6 className="text-muted">Consistency Streak</h6>
                              <div className="d-flex justify-content-center">
                                {[...Array(7)].map((_, i) => (
                                  <div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 15,
                                      delay: 0.9 + i * 0.1,
                                    }}
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50%",
                                      margin: "0 2px",
                                      backgroundColor:
                                        i < practiceMetrics.consistencyStreak
                                          ? "#28a745"
                                          : "#e9ecef",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color:
                                        i < practiceMetrics.consistencyStreak
                                          ? "white"
                                          : "#6c757d",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                      boxShadow:
                                        i < practiceMetrics.consistencyStreak
                                          ? "0 0 10px rgba(40, 167, 69, 0.5)"
                                          : "none",
                                    }}
                                  >
                                    {i + 1}
                                  </div>
                                ))}
                              </div>
                              <p className="mt-2 mb-0 text-muted small">
                                4 days in a row!
                              </p>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>

                      <Col sm={6} className="mb-4">
                        <div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                        >
                          <Card className="h-100 border-0 shadow-sm bg-white">
                            <Card.Body>
                              <h6 className="text-muted text-center mb-3">
                                Peak Learning Times
                              </h6>
                              <div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                              >
                                <ResponsiveContainer width="100%" height={100}>
                                  <BarChart
                                    data={practiceMetrics.peakLearningTimes}
                                    layout="vertical"
                                  >
                                    <XAxis type="number" hide />
                                    <YAxis
                                      dataKey="hour"
                                      type="category"
                                      width={80}
                                      axisLine={false}
                                      tickLine={false}
                                      tick={{ fill: "#495057" }}
                                    />
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#dee2e6",
                                      }}
                                    />
                                    <Bar
                                      dataKey="sessions"
                                      fill="#17a2b8"
                                      radius={[0, 4, 4, 0]}
                                      animationDuration={1500}
                                      animationEasing="ease-out"
                                    >
                                      {practiceMetrics.peakLearningTimes.map(
                                        (entry, index) => (
                                          <Cell
                                            key={`cell-${index}`}
                                            fill={`rgba(23, 162, 184, ${
                                              0.6 +
                                              (index /
                                                practiceMetrics
                                                  .peakLearningTimes.length) *
                                                0.4
                                            })`}
                                          />
                                        )
                                      )}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Col>

          <Col md={6}>
            <div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                onClick={() => {
                  console.log("tingting");
                }}
                title="Learn More"
                color="#841584"
              >
                ssss{" "}
              </Button>
              <Card className="shadow-lg h-100 border-light">
                <Card.Header className="bg-info text-white">
                  <h4 className="mb-0">Word Cloud & Common Phrases</h4>
                </Card.Header>
                <Card.Body className="text-center">
                  <div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-4"
                  >
                    <h5 className="mb-3">Most Used Words</h5>
                    <div
                      className="word-cloud-container p-3"
                      style={{
                        minHeight: "200px",
                        // background: "linear-gradient(145deg, #f8f9fa, #e9ecef)",
                        borderRadius: "10px",
                        boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      {wordCloudData.map((word, index) => {
                        const fontSize = 32 + word.value / 2;
                        const opacity = 0.7 + (word.accuracy / 100) * 0.3;

                        return (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              // delay: 0.1 + index * 0.05,
                              type: "spring",
                              stiffness: 200,
                            }}
                            style={{ display: "inline-block" }}
                          >
                            <Badge
                              // pill
                              className="m-1"
                              style={{
                                fontSize: `${fontSize}px`,
                                padding: "8px 12px",
                                cursor: "pointer",
                                background: `linear-gradient(145deg, rgba(52, 152, 219, ${opacity}), rgba(52, 152, 219, ${
                                  opacity - 0.2
                                }))`,
                                display: "inline-block",
                                border: "1px solid rgba(255, 255, 255, 0.5)",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                color: "white",
                                borderRadius: "30px",
                              }}
                              onClick={() => handleWordClick(word.text)}
                            >
                              {word.text}
                            </Badge>
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    // className="d-flex justify-content-center"
                  >
                    <h5 className="mb-3 text-center">Common Mistakes</h5>
                    <Row className="justify-content-center">
                      {Object.keys(wordMetrics)
                        .filter((word) => wordMetrics[word].avgAccuracy < 70)
                        .slice(0, 4)
                        .map((word, index) => {
                          const metrics = wordMetrics[word];
                          return (
                            <Col key={index} md={6} className="mb-3">
                              <div
                                initial={{
                                  opacity: 0,
                                  x: index % 2 === 0 ? -20 : 20,
                                }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: 1.0 + index * 0.1,
                                }}
                              >
                                <Card
                                  className="needs-improvement-card"
                                  onClick={() => handleWordClick(word)}
                                  style={{
                                    cursor: "pointer",
                                    backgroundImage:
                                      "linear-gradient(145deg, #fff0f0, #ffe6e6)",
                                    border: "1px solid #f8d7da",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <Card.Body className="text-center py-2">
                                    <h5 className="mb-1 text-dark">{word}</h5>
                                    <p className="mb-0 small text-dark">
                                      Accuracy:{" "}
                                      <span className="text-danger">
                                        {metrics.avgAccuracy}%
                                      </span>
                                    </p>
                                  </Card.Body>
                                </Card>
                              </div>
                            </Col>
                          );
                        })}
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <Card className="shadow-lg border-light">
                <Card.Header className="bg-secondary text-white">
                  <h4 className="mb-0">Recent Practice Sessions</h4>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Duration</th>
                          <th>Accuracy</th>
                          <th>Fluency</th>
                          <th>Completeness</th>
                          <th>Overall Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((session, index) => {
                          const date = new Date().toLocaleDateString();
                          const duration = Math.floor(
                            Number((session.Duration / 10000000).toFixed(2))
                          );
                          const metrics =
                            session.NBest[0].PronunciationAssessment;

                          return (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: 1.2 + index * 0.1,
                              }}
                            >
                              <td>
                                {new Date(date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td>{duration} min</td>
                              <td>
                                <motion.span
                                  className={`badge bg-${getScoreColor(
                                    metrics.AccuracyScore
                                  )}`}
                                >
                                  {metrics.AccuracyScore}%
                                </motion.span>
                              </td>
                              <td>
                                <motion.span
                                  className={`badge bg-${getScoreColor(
                                    metrics.FluencyScore
                                  )}`}
                                >
                                  {metrics.FluencyScore}%
                                </motion.span>
                              </td>
                              <td>
                                <motion.span
                                  className={`badge bg-${getScoreColor(
                                    metrics.CompletenessScore
                                  )}`}
                                >
                                  {metrics.CompletenessScore}%
                                </motion.span>
                              </td>
                              <td>
                                <motion.span
                                  className={`badge bg-${getScoreColor(
                                    metrics.PronScore
                                  )}`}
                                >
                                  {metrics.PronScore.toFixed(1)}%
                                </motion.span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Floating Action Button */}
        <div
          className="position-fixed"
          style={{ bottom: "30px", right: "30px", zIndex: 999 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.5,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Button
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: "0 4px 10px rgba(0, 123, 255, 0.5)",
              background: "linear-gradient(145deg, #0069d9, #007bff)",
              border: "none",
            }}
          >
            <i className="bi bi-plus"></i>
          </Button>
        </div>

        {renderWordModal()}
      </Container>
    </div>
  );
};

export default MandarinDashboard;
