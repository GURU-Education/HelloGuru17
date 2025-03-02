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
import { motion, AnimatePresence } from "framer-motion";
import _ from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";

// Custom dark theme CSS
const darkThemeStyles = `
  body {
    background-color: #121212;
    color: #e0e0e0;
  }
  
  .bg-dark-custom {
    background-color: #1e1e1e !important;
  }
  
  .bg-dark-accent {
    background-color: #2d2d2d !important;
  }
  
  .card {
    background-color: #1e1e1e;
    border: 1px solid #333;
  }
  
  .card-header {
    border-bottom: 1px solid #333;
  }
  
  .text-muted {
    color: #aaaaaa !important;
  }
  
  .table {
    color: #e0e0e0;
  }
  
  .table thead th {
    border-bottom-color: #333;
  }
  
  .table td, .table th {
    border-top-color: #333;
  }
  
  .modal-content {
    background-color: #1e1e1e;
    border: 1px solid #333;
  }
  
  .modal-header, .modal-footer {
    border-color: #333;
  }
  
  .list-group-item {
    background-color: #1e1e1e;
    border-color: #333;
  }
  
  .nav-tabs {
    border-bottom-color: #333;
  }
  
  .nav-tabs .nav-link.active {
    background-color: #2d2d2d;
    border-color: #333 #333 #2d2d2d;
    color: #e0e0e0;
  }
  
  .nav-tabs .nav-link {
    color: #aaaaaa;
  }
  
  .nav-tabs .nav-link:hover {
    border-color: #333 #333 #333;
  }
  
  .alert-info {
    background-color: #193047;
    border-color: #175073;
    color: #9fcdff;
  }
  
  /* Custom card glow effects */
  .card-glow:hover {
    box-shadow: 0 0 15px rgba(var(--glow-color-rgb), 0.7) !important;
    border-color: rgba(var(--glow-color-rgb), 0.7) !important;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1e1e1e;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #777;
  }
`;
const MandarinDashboard = () => {
  // Parse the JSON data
  const [sessions, setSessions] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wordMetrics, setWordMetrics] = useState({});
  const [, setWordHistory] = useState([]);

  useEffect(() => {
    // const styleElement = document.createElement("style");
    // styleElement.innerHTML = darkThemeStyles;
    // document.head.appendChild(styleElement);
    // In a real app, you would fetch this data
    const data = [
      {
        Id: "0e078acf09b44342b650683235fd407b",
        RecognitionStatus: "Success",
        Offset: 168700000,
        Duration: 226000000,
        Channel: 0,
        DisplayText:
          "你好，就我一个人，请给我一个靠窗的座位，谢谢，我想点宫保鸡丁和一份米饭好的，谢谢。",
        SNR: 26.458223,
        NBest: [
          {
            Confidence: 0.772628,
            Lexical:
              "你好 就 我 一个 人 请 给 我 一个 靠 窗 的 座位 谢谢 我 想 点 宫保鸡丁 和 一 份 米饭 好 的 谢谢",
            ITN: "你好 就 我 一个 人 请 给 我 一个 靠 窗 的 座位 谢谢 我 想 点 宫保鸡丁 和 一 份 米饭 好 的 谢谢",
            MaskedITN:
              "你好就我一个人请给我一个靠窗的座位谢谢我想点宫保鸡丁和一份米饭好的谢谢",
            Display:
              "你好，就我一个人，请给我一个靠窗的座位，谢谢，我想点宫保鸡丁和一份米饭好的，谢谢。",
            PronunciationAssessment: {
              AccuracyScore: 62,
              FluencyScore: 41,
              CompletenessScore: 52,
              PronScore: 47.4,
            },
            Words: [
              {
                Word: "你好",
                Offset: 168700000,
                Duration: 11600000,
                PronunciationAssessment: {
                  AccuracyScore: 79,
                  ErrorType: "None",
                },
              },
              {
                Word: "就",
                Offset: 183700000,
                Duration: 3500000,
                PronunciationAssessment: {
                  AccuracyScore: 60,
                  ErrorType: "None",
                },
              },
            ],
          },
        ],
      },
      {
        Id: "1f29bcdf34a84212b983f7352fe56789",
        RecognitionStatus: "Success",
        Offset: 170000000,
        Duration: 230000000,
        Channel: 0,
        DisplayText: "你好，我想要一个靠窗的座位，谢谢，请给我宫保鸡丁和米饭。",
        SNR: 25.987654,
        NBest: [
          {
            Confidence: 0.785432,
            Lexical:
              "你好 我 想 要 一个 靠 窗 的 座位 谢谢 请 给 我 宫保鸡丁 和 米饭",
            ITN: "你好 我 想 要 一个 靠 窗 的 座位 谢谢 请 给 我 宫保鸡丁 和 米饭",
            MaskedITN: "你好我想要一个靠窗的座位谢谢请给我宫保鸡丁和米饭",
            Display: "你好，我想要一个靠窗的座位，谢谢，请给我宫保鸡丁和米饭。",
            PronunciationAssessment: {
              AccuracyScore: 64,
              FluencyScore: 43,
              CompletenessScore: 55,
              PronScore: 49.1,
            },
            Words: [
              {
                Word: "你好",
                Offset: 170000000,
                Duration: 12000000,
                PronunciationAssessment: {
                  AccuracyScore: 82,
                  ErrorType: "None",
                },
              },
              {
                Word: "我",
                Offset: 182500000,
                Duration: 3000000,
                PronunciationAssessment: {
                  AccuracyScore: 90,
                  ErrorType: "None",
                },
              },
            ],
          },
        ],
      },
      {
        Id: "2a3c4d5e6f784512acde90234567b890",
        RecognitionStatus: "Success",
        Offset: 172500000,
        Duration: 240000000,
        Channel: 0,
        DisplayText:
          "你好，我一个人，请给我一个靠窗的位置，谢谢，我想点宫保鸡丁和米饭。",
        SNR: 27.123456,
        NBest: [
          {
            Confidence: 0.790321,
            Lexical:
              "你好 我 一个 人 请 给 我 一个 靠 窗 的 位置 谢谢 我 想 点 宫保鸡丁 和 米饭",
            ITN: "你好 我 一个 人 请 给 我 一个 靠 窗 的 位置 谢谢 我 想 点 宫保鸡丁 和 米饭",
            MaskedITN:
              "你好我一个人请给我一个靠窗的位置谢谢我想点宫保鸡丁和米饭",
            Display:
              "你好，我一个人，请给我一个靠窗的位置，谢谢，我想点宫保鸡丁和米饭。",
            PronunciationAssessment: {
              AccuracyScore: 65,
              FluencyScore: 45,
              CompletenessScore: 58,
              PronScore: 50.6,
            },
            Words: [
              {
                Word: "你好",
                Offset: 172500000,
                Duration: 11500000,
                PronunciationAssessment: {
                  AccuracyScore: 85,
                  ErrorType: "None",
                },
              },
              {
                Word: "一个",
                Offset: 184000000,
                Duration: 3700000,
                PronunciationAssessment: {
                  AccuracyScore: 100,
                  ErrorType: "None",
                },
              },
            ],
          },
        ],
      },
      {
        Id: "3b4d5e6f7a8b9c10def2345678901234",
        RecognitionStatus: "Success",
        Offset: 175000000,
        Duration: 235000000,
        Channel: 0,
        DisplayText: "你好，我想要靠窗的位置，谢谢，请给我一份宫保鸡丁和米饭。",
        SNR: 28.654321,
        NBest: [
          {
            Confidence: 0.799876,
            Lexical:
              "你好 我 想 要 靠 窗 的 位置 谢谢 请 给 我 一 份 宫保鸡丁 和 米饭",
            ITN: "你好 我 想 要 靠 窗 的 位置 谢谢 请 给 我 一 份 宫保鸡丁 和 米饭",
            MaskedITN: "你好我想要靠窗的位置谢谢请给我一份宫保鸡丁和米饭",
            Display: "你好，我想要靠窗的位置，谢谢，请给我一份宫保鸡丁和米饭。",
            PronunciationAssessment: {
              AccuracyScore: 67,
              FluencyScore: 48,
              CompletenessScore: 60,
              PronScore: 52.3,
            },
            Words: [
              {
                Word: "你好",
                Offset: 175000000,
                Duration: 11000000,
                PronunciationAssessment: {
                  AccuracyScore: 88,
                  ErrorType: "None",
                },
              },
              {
                Word: "位置",
                Offset: 186000000,
                Duration: 4000000,
                PronunciationAssessment: {
                  AccuracyScore: 92,
                  ErrorType: "None",
                },
              },
            ],
          },
        ],
      },
    ];

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
        const toneAccuracy = Math.min(
          100,
          (word.PronunciationAssessment?.AccuracyScore || 0) +
            Math.floor(Math.random() * 15 - 5)
        );
        const fluencyScore =
          session.NBest[0].PronunciationAssessment?.FluencyScore || 0;
        const stressPattern = Math.min(
          100,
          fluencyScore + Math.floor(Math.random() * 20 - 10)
        );
        const speedWPM = 60 + Math.floor(Math.random() * 40);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
        {/* Dashboard Header */}
        <motion.div
          className="dashboard-header text-center mb-5"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="mb-4 position-relative d-inline-block">
            <h1
              className="display-4 fw-bold mb-0"
              style={{
                background: "linear-gradient(135deg, #007bff, #6610f2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 5px 15px rgba(0,0,0,0.1)",
              }}
            >
              XiaoQiu [小球] Dashboard
            </h1>
            <div className="position-absolute" style={{ top: -15, right: -30 }}>
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <Badge
                  bg="warning"
                  pill
                  className="px-3 py-2 shadow-lg"
                  style={{ transform: "rotate(15deg)" }}
                >
                  <i className="bi bi-stars me-1"></i> VIP
                </Badge>
              </motion.div>
            </div>
          </div>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Your personalized dashboard for tracking pronunciation progress and
            practice habits
          </p>

          <motion.div
            className="dashboard-stats d-flex flex-wrap justify-content-center gap-3 mt-4 mb-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              {
                icon: "calendar3",
                label: "Last Session",
                value: "Yesterday",
                color: "#4361ee",
              },
              {
                icon: "clock-history",
                label: "Total Practice",
                value: "120 min",
                color: "#3a0ca3",
              },
              {
                icon: "star-fill",
                label: "Top Word",
                value: "你好",
                color: "#7209b7",
              },
              {
                icon: "trophy",
                label: "Most Improved",
                value: "78.5%",
                color: "#f72585",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-badge py-2 px-3 rounded-pill shadow-sm d-flex align-items-center bg-white"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div
                  className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: stat.color,
                    color: "white",
                  }}
                >
                  <i className={`bi bi-${stat.icon}`}></i>
                </div>
                <div className="d-flex flex-column">
                  <span className="stat-label small text-muted">
                    {stat.label}
                  </span>
                  <span className="stat-value fw-bold">{stat.value}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* <Row className="mb-4">
          <Col>
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center position-relative">
                <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    V
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    i
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    e
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    w
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {" "}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                  >
                    Y
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    o
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                  >
                    u
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    r
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.45 }}
                  >
                    {" "}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    S
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                  >
                    t
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    a
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.65 }}
                  >
                    t
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    s
                  </motion.span>
                </h1>

                <motion.p
                  className="text-center text-muted lead"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Track your pronunciation progress and practice habits
                </motion.p>

                <motion.div
                  className="d-flex justify-content-center align-items-center mb-4 mt-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className="d-flex gap-2 flex-wrap justify-content-center">
                    <div className="badge bg-light text-dark p-2 border shadow-sm">
                      <i className="bi bi-calendar3 me-1 text-primary"></i>
                      Last Session: Yesterday
                    </div>
                    <div className="badge bg-light text-dark p-2 border shadow-sm">
                      <i className="bi bi-clock-history me-1 text-success"></i>
                      Total Practice: 120 min
                    </div>
                    <div className="badge bg-light text-dark p-2 border shadow-sm">
                      <i className="bi bi-star-fill me-1 text-warning"></i>
                      Top Word: 你好
                    </div>
                    <div className="badge bg-light text-dark p-2 border shadow-sm">
                      <i className="bi bi-trophy me-1 text-danger"></i>
                      Most Improved: 78.5%
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="text-center quote-container p-3 bg-light rounded-3 border mb-4 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  style={{ maxWidth: "800px", margin: "0 auto" }}
                >
                  <i className="bi bi-quote fs-3 text-primary"></i>
                  <blockquote className="blockquote mb-0">
                    <p className="fst-italic">
                      "Learning a language is a journey of a thousand small
                      victories."
                    </p>
                    <footer className="blockquote-footer">
                      Chinese Proverb
                    </footer>
                  </blockquote>
                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="d-flex justify-content-center gap-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-pill"
                      >
                        <i className="bi bi-shuffle me-1"></i>
                        New Quote
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="rounded-pill"
                      >
                        <i className="bi bi-share me-1"></i>
                        Share
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </Col>
        </Row> */}
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
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                rotate: Math.random() * 360,
              }}
              animate={{
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 60 + 60,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                // position: "absolute",
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                borderRadius: "50%",
                background: `rgba(${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, 0.05)`,
                filter: "blur(20px)",
              }}
            />
          ))}
        </div>
        <Row className="mb-4">
          <Col>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg border-light">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">Speaking & Pronunciation Metrics</h4>
                </Card.Header>
                <Card.Body>
                  <motion.div
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
                  </motion.div>

                  <Row>
                    {Object.keys(wordMetrics).map((word, index) => {
                      const metrics = wordMetrics[word];
                      const scoreColor = getScoreColor(metrics.avgAccuracy);

                      return (
                        <Col key={index} md={3} sm={6} className="mb-3">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.01 * index,
                              type: "spring",
                              stiffness: 200,
                              damping: 20,
                            }}
                            whileHover={{
                              scale: 1.05,
                              boxShadow: `0 0 15px rgba(var(--bs-${scoreColor}-rgb), 0.5)`,
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              className="h-100 word-card shadow"
                              onClick={() => handleWordClick(word)}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                border: `1px solid var(--bs-${scoreColor})`,
                                backgroundColor: "#fff",
                              }}
                            >
                              <Card.Body className="text-center">
                                <h3 className="mb-2">{word}</h3>
                                <motion.div
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
                                      width: "90px",
                                      height: "90px",
                                      borderRadius: "50%",
                                      backgroundColor: `var(--bs-${scoreColor})`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "white",
                                      fontWeight: "bold",
                                      fontSize: "20px",
                                      boxShadow: `0 0 10px rgba(var(--bs-${scoreColor}-rgb), 0.5)`,
                                    }}
                                  >
                                    {metrics.avgAccuracy}%
                                  </div>
                                </motion.div>
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
                          </motion.div>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <motion.div
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
                        <motion.div
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
                        </motion.div>
                      </Col>

                      <Col sm={6} className="mb-4">
                        <motion.div
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
                        </motion.div>
                      </Col>

                      <Col sm={6} className="mb-4">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                        >
                          <Card className="h-100 border-0 shadow-sm bg-white">
                            <Card.Body className="text-center">
                              <h6 className="text-muted">Consistency Streak</h6>
                              <div className="d-flex justify-content-center">
                                {[...Array(7)].map((_, i) => (
                                  <motion.div
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
                                  </motion.div>
                                ))}
                              </div>
                              <p className="mt-2 mb-0 text-muted small">
                                4 days in a row!
                              </p>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>

                      <Col sm={6} className="mb-4">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                        >
                          <Card className="h-100 border-0 shadow-sm bg-white">
                            <Card.Body>
                              <h6 className="text-muted text-center mb-3">
                                Peak Learning Times
                              </h6>
                              <motion.div
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
                              </motion.div>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="shadow-lg h-100 border-light">
                <Card.Header className="bg-info text-white">
                  <h4 className="mb-0">Word Cloud & Common Phrases</h4>
                </Card.Header>
                <Card.Body className="text-center">
                  <motion.div
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
                            whileHover={{
                              scale: 1.2,
                              boxShadow: "0 0 4px rgba(52, 152, 219, 0.6)",
                            }}
                            style={{ display: "inline-block" }}
                          >
                            <Badge
                              pill
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
                              }}
                              onClick={() => handleWordClick(word.text)}
                            >
                              {word.text}
                            </Badge>
                          </motion.span>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div
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
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  x: index % 2 === 0 ? -20 : 20,
                                }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: 1.0 + index * 0.1,
                                }}
                                whileHover={{
                                  scale: 1.05,
                                  boxShadow: "0 0 15px rgba(220, 53, 69, 0.4)",
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
                              </motion.div>
                            </Col>
                          );
                        })}
                    </Row>
                  </motion.div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row>
          <Col>
            <motion.div
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
                          const date = new Date(
                            session.Offset / 10000
                          ).toLocaleDateString();
                          const duration = (
                            session.Duration / 60000000
                          ).toFixed(2);
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
                              whileHover={{
                                backgroundColor: "rgba(0, 123, 255, 0.05)",
                                transition: { duration: 0.2 },
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
                                  whileHover={{ scale: 1.2 }}
                                >
                                  {metrics.AccuracyScore}%
                                </motion.span>
                              </td>
                              <td>
                                <motion.span
                                  className={`badge bg-${getScoreColor(
                                    metrics.FluencyScore
                                  )}`}
                                  whileHover={{ scale: 1.2 }}
                                >
                                  {metrics.FluencyScore}%
                                </motion.span>
                              </td>
                              <td>
                                <motion.span
                                  className={`badge bg-${getScoreColor(
                                    metrics.CompletenessScore
                                  )}`}
                                  whileHover={{ scale: 1.2 }}
                                >
                                  {metrics.CompletenessScore}%
                                </motion.span>
                              </td>
                              <td>
                                <motion.span
                                  className={`badge bg-${getScoreColor(
                                    metrics.PronScore
                                  )}`}
                                  whileHover={{ scale: 1.2 }}
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
            </motion.div>
          </Col>
        </Row>

        {/* Floating Action Button */}
        <motion.div
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
        </motion.div>

        {renderWordModal()}
      </Container>
    </motion.div>
  );
};

export default MandarinDashboard;
