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
import _ from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";

const MandarinDashboard = () => {
  // Parse the JSON data
  const [sessions, setSessions] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wordMetrics, setWordMetrics] = useState({});
  const [wordHistory, setWordHistory] = useState([]);

  useEffect(() => {
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
                    <small className="text-muted">
                      Optimal range: 70-90 WPM for beginners
                    </small>
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
    <Container fluid className="py-4 bg-light min-vh-100">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">Mandarin Learning Dashboard</h1>
          <p className="text-center text-muted">
            Track your pronunciation progress and practice habits
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Speaking & Pronunciation Metrics</h4>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-4">
                Click on any word to see detailed metrics and progress over
                time.
              </p>

              <Row>
                {Object.keys(wordMetrics).map((word, index) => {
                  const metrics = wordMetrics[word];
                  const scoreColor = getScoreColor(metrics.avgAccuracy);

                  return (
                    <Col key={index} md={3} sm={6} className="mb-3">
                      <Card
                        className="h-100 word-card shadow-sm"
                        onClick={() => handleWordClick(word)}
                        style={{
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          border: `1px solid ${scoreColor}`,
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <Card.Body className="text-center">
                          <h3 className="mb-2">{word}</h3>
                          <div className="d-flex justify-content-center align-items-center mb-2">
                            <div
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: `var(--bs-${scoreColor})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "15px",
                              }}
                            >
                              {metrics.avgAccuracy}%
                            </div>
                          </div>
                          <div className="mt-2">
                            <small className="text-muted d-block">
                              Practice count: {metrics.count}
                            </small>
                            <small className="text-muted d-block">
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
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">Engagement & Practice Habits</h4>
            </Card.Header>
            <Card.Body>
              {practiceMetrics && (
                <Row>
                  <Col sm={6} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body className="text-center">
                        <h6 className="text-muted">Total Speaking Time</h6>
                        <h2 className="text-success mb-0">
                          {practiceMetrics.totalSpeakingTimeMin} min
                        </h2>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col sm={6} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body className="text-center">
                        <h6 className="text-muted">Avg. Session Length</h6>
                        <h2 className="text-primary mb-0">
                          {practiceMetrics.avgSessionLengthMin} min
                        </h2>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col sm={6} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body className="text-center">
                        <h6 className="text-muted">Consistency Streak</h6>
                        <div className="d-flex justify-content-center">
                          {[...Array(7)].map((_, i) => (
                            <div
                              key={i}
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
                  </Col>

                  <Col sm={6} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body>
                        <h6 className="text-muted text-center mb-3">
                          Peak Learning Times
                        </h6>
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
                            />
                            <Tooltip />
                            <Bar
                              dataKey="sessions"
                              fill="#17a2b8"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-info text-white">
              <h4 className="mb-0">Word Cloud & Common Phrases</h4>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="mb-4">
                <h5 className="mb-3">Most Used Words</h5>
                <div
                  className="word-cloud-container p-3"
                  style={{ minHeight: "200px" }}
                >
                  {wordCloudData.map((word, index) => {
                    const fontSize = 12 + word.value / 5;
                    const opacity = 0.7 + (word.accuracy / 100) * 0.3;
                    return (
                      <Badge
                        key={index}
                        pill
                        className="m-1"
                        style={{
                          fontSize: `${fontSize}px`,
                          padding: "8px 12px",
                          cursor: "pointer",
                          backgroundColor: `rgba(52, 152, 219, ${opacity})`,
                          display: "inline-block",
                        }}
                        onClick={() => handleWordClick(word.text)}
                      >
                        {word.text}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div>
                <h5 className="mb-3">Common Mistakes</h5>
                <Row>
                  {Object.keys(wordMetrics)
                    .filter((word) => wordMetrics[word].avgAccuracy < 70)
                    .slice(0, 4)
                    .map((word, index) => {
                      const metrics = wordMetrics[word];
                      return (
                        <Col key={index} md={6} className="mb-3">
                          <Card
                            className="needs-improvement-card"
                            onClick={() => handleWordClick(word)}
                            style={{
                              cursor: "pointer",
                              backgroundColor: "#fff0f0",
                            }}
                          >
                            <Card.Body className="text-center py-2">
                              <h5 className="mb-1">{word}</h5>
                              <p className="mb-0 small">
                                Accuracy:{" "}
                                <span className="text-danger">
                                  {metrics.avgAccuracy}%
                                </span>
                              </p>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
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
                      const duration = (session.Duration / 60000000).toFixed(2);
                      const metrics = session.NBest[0].PronunciationAssessment;

                      return (
                        <tr key={index}>
                          <td>{date}</td>
                          <td>{duration} min</td>
                          <td>
                            <span
                              className={`badge bg-${getScoreColor(
                                metrics.AccuracyScore
                              )}`}
                            >
                              {metrics.AccuracyScore}%
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getScoreColor(
                                metrics.FluencyScore
                              )}`}
                            >
                              {metrics.FluencyScore}%
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getScoreColor(
                                metrics.CompletenessScore
                              )}`}
                            >
                              {metrics.CompletenessScore}%
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getScoreColor(
                                metrics.PronScore
                              )}`}
                            >
                              {metrics.PronScore.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {renderWordModal()}
    </Container>
  );
};

export default MandarinDashboard;
