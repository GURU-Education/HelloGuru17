<<<<<<< HEAD
import Image from "next/image";
import styles from "./page.module.css";
import Flashcard from "./components/Flashcard";
import "./page.css";

export default function Home() {
  return (
    <div className="background">
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
      <Flashcard
        chineseCharacter="你"
        pinyin="nǐ"
        englishTranslation="you"
        indonesianTranslation="kamu"
      />
    </div>
=======
"use client";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./_components/home";

import "./styles/page.css";

const queryClient = new QueryClient();

export default function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
>>>>>>> main
  );
}
