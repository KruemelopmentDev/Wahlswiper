function WahlSwiper(questions, parties, answers) {
  this.questions = questions.reverse();
  this.parties = parties;
  this.answers = answers;
  numberofCards = questions.length;
  questionResults = [];
  questionIndex = 0;
  questionMaxIndex = 0;
  animating = false;
  cardsCounter = 0;
  decisionVal = 80;
  pullDeltaX = 0;
  pullDeltaY = 0;
  deg = 0;
  this.$card,
    this.$cardLike,
    this.$cardNeutral,
    this.$cardReject,
    this.$dragger,
    this.$parentDIVDOM,
    this.$buttonBack,
    this.$buttonForward,
    this.$questionCount;

  postInit = function () {
    $buttonBack = $("#buttonBack");
    $buttonForward = $("#buttonForward");
    $questionCount = $("#questionCount");
    updateNavigate();
    setupListeners();
  };

  this.createCards = function (parentDIV) {
    $parentDIVDOM = $("#" + parentDIV);
    $parentDIVDOM.addClass("wahlswiper");
    let applyHTML = `
        <div class="demo__content" id="swiper">
            <div class="decidebuttons">
                <div id="buttonBack" class="chevronbutton chevron left disabled">
                </div>
                <div class="flex center">
                    <p id="questionCount"></p>
                </div>
                <div id="buttonForward" class="chevronbutton chevron right disabled">
                </div>
            </div>
            <div class="demo__card-cont botmargin" id="card">`;
    for (let index = 0; index < questions.length; index++) {
      const element = questions[index];
      applyHTML +=
        `
                    <div class="demo__card" id="card` +
        (numberofCards - index) +
        `">
                    <div class="demo__card__top">`;
      if (element["imageURL"] != null) {
        applyHTML += `<img class="img" src="` + element["imageURL"] + `">`;
      }
      applyHTML +=
        `<div class="questionWrapper">
                            <h3 class="questionHeadline">Frage ` +
        (numberofCards - index) +
        `</h3>
                            <p class="question">` +
        element["question"] +
        `</p>
                        </div>
                        <div class="inputwrapper">
                            <input class="inp-cbx" id="cbx` +
        index +
        `" type="checkbox" style="display: none" />
                            <label class="cbx" for="cbx` +
        index +
        `"><span>
                                    <svg width="12px" height="9px" viewbox="0 0 12 9">
                                        <polyline points="1 5 4 8 11 1"></polyline>
                                    </svg></span><span class="doubleweight">Doppelt gewichten</span></label>
                        </div>
                    </div>
                    <div class="demo__card__choice m--reject">
                        <img src="thumb.svg" class="thumb" />
                    </div>
                    <div class="demo__card__choice m--like">
                        <img src="thumb.svg" class="thumb rotate180"/>
                    </div>
                    <div class="demo__card__choice m--neutral">
                        <img src="thumb.svg" class="thumb rotate270"/>
                    </div>
                    <div class="demo__card__drag"></div>
                </div>`;
    }
    applyHTML += `
            </div>
            <div class="decidebuttons">
                <div id="dismiss" class="button submitbtn">
                    <div class="close"></div>
                </div>
                <div id="skip" class="skipbutton submitbtn nopadding">
                    <p>Überspringen</p>
                </div>
                <div id="like" class="button submitbtn">
                    <div class="check"></div>
                </div>
            </div>
        </div>`;
    $parentDIVDOM.append(applyHTML);
    postInit();
  };
  pullChange = function () {
    animating = true;
    if (
      ((pullDeltaX < Math.abs(pullDeltaY) && pullDeltaY < 0) ||
        ($cardNeutral.css("opacity") != 0 && pullDeltaY < 0)) &&
      $cardLike.css("opacity") == 0 &&
      $cardReject.css("opacity") == 0
    ) {
      $card.css("transform", "translateY(" + pullDeltaY + "px)");
      const opacity = pullDeltaY / 100;
      $cardNeutral.css("opacity", Math.abs(opacity));
    } else {
      deg = pullDeltaX / 10;
      $card.css(
        "transform",
        "translateX(" + pullDeltaX + "px) rotate(" + deg + "deg)"
      );
      const opacity = pullDeltaX / 100;
      const rejectOpacity = opacity >= 0 ? 0 : Math.abs(opacity);
      const likeOpacity = opacity <= 0 ? 0 : opacity;
      $cardReject.css("opacity", rejectOpacity);
      $cardLike.css("opacity", likeOpacity);
    }
  };
  release = function () {
    let animStarted = false;
    if (
      pullDeltaX < Math.abs(pullDeltaY) &&
      Math.abs(pullDeltaY) >= decisionVal &&
      $cardNeutral.css("opacity") != 0 &&
      $cardLike.css("opacity") == 0 &&
      $cardReject.css("opacity") == 0
    ) {
      $card.addClass("to-top");
      animStarted = true;
      storeResult(1, $("#cbx" + (cardsCounter + 1), $card));
    } else if (pullDeltaX >= decisionVal) {
      $card.addClass("to-right");
      animStarted = true;
      storeResult(2, $("#cbx" + (cardsCounter + 1), $card));
    } else if (pullDeltaX <= -decisionVal) {
      $card.addClass("to-left");
      animStarted = true;
      storeResult(0, $("#cbx" + (cardsCounter + 1), $card));
    }

    if (animStarted) {
      $card.addClass("inactive");

      setTimeout(function () {
        $card.addClass("hide").removeClass("inactive to-left to-right to-top");
        cardsCounter++;
        updateNavigate();
        if (cardsCounter === numberofCards) {
          calculateResult();
        }
      }, 300);
    }

    if (!animStarted) {
      $card.addClass("reset");
    }

    setTimeout(function () {
      $card
        .attr("style", "")
        .removeClass("reset")
        .find(".demo__card__choice")
        .attr("style", "");

      pullDeltaX = 0;
      pullDeltaY = 0;
      animating = false;
      $cardReject.css("z-index", 0);
      $cardLike.css("z-index", 0);
      $cardNeutral.css("z-index", 0);
      $dragger.css("z-index", 5);
    }, 300);
  };

  releaseClick = function (direction) {
    if (animating) return;
    animating = true;
    $card = $("#card" + (cardsCounter + 1));
    $cardReject = $(".demo__card__choice.m--reject", $card);
    $cardLike = $(".demo__card__choice.m--like", $card);
    $cardNeutral = $(".demo__card__choice.m--neutral", $card);
    $dragger = $(".demo__card__drag", $card);

    if (direction == 2) {
      $card.addClass("to-right");
      $cardLike.addClass("buttonanimate opacity");
    } else if (direction == 0) {
      $card.addClass("to-left");
      $cardReject.addClass("buttonanimate opacity");
    } else if (direction == 1) {
      $card.addClass("to-top");
      $cardNeutral.addClass("buttonanimate opacity");
    }
    storeResult(direction, $("#cbx" + (cardsCounter + 1), $card));

    $cardReject.css("z-index", 200);
    $cardLike.css("z-index", 200);
    $cardNeutral.css("z-index", 200);
    $dragger.css("z-index", 201);
    $card.addClass("inactive2");

    setTimeout(function () {
      $card.addClass("hide").removeClass("inactive to-left to-right to-top");
      $cardLike.removeClass("buttonanimate opacity");
      $cardReject.removeClass("buttonanimate opacity");
      $cardNeutral.removeClass("buttonanimate opacity");
      $card
        .attr("style", "")
        .removeClass("reset")
        .find(".demo__card__choice")
        .attr("style", "");

      pullDeltaX = 0;
      pullDeltaY = 0;
      animating = false;
      $cardReject.css("z-index", 0);
      $cardLike.css("z-index", 0);
      $cardNeutral.css("z-index", 0);
      $dragger.css("z-index", 5);
      cardsCounter++;
      updateNavigate();
      if (cardsCounter === numberofCards) {
        calculateResult();
      }
    }, 300);
  };

  storeResult = function (answer, inputElement) {
    if (questionIndex == questionMaxIndex) {
      questionResults.push({
        answer: answer,
        double: inputElement.is(":checked"),
      });
      questionIndex++;
      questionMaxIndex++;
    } else {
      questionResults[questionIndex] = {
        answer: answer,
        double: inputElement.is(":checked"),
      };
      questionIndex++;
    }
  };
  updateNavigate = function () {
    if (questionMaxIndex == numberofCards) return;
    if (questionIndex == questionMaxIndex) $buttonForward.addClass("disabled");
    else $buttonForward.removeClass("disabled");
    if (questionIndex > 0) $buttonBack.removeClass("disabled");
    else $buttonBack.addClass("disabled");
    $questionCount.text(questionIndex + 1 + "/" + numberofCards);
  };

  setupListeners = function () {
    $(document).on(
      "mousedown touchstart",
      ".demo__card:not(.inactive)",
      function (e) {
        if (animating) return;

        $card = $(this);
        $cardReject = $(".demo__card__choice.m--reject", $card);
        $cardLike = $(".demo__card__choice.m--like", $card);
        $cardNeutral = $(".demo__card__choice.m--neutral", $card);
        $dragger = $(".demo__card__drag", $card);
        let startX = e.pageX || e.originalEvent.touches[0].pageX;
        let startY = e.pageY || e.originalEvent.touches[0].pageY;

        $(document).on("mousemove touchmove", function (e) {
          $cardReject.css("z-index", 200);
          $cardLike.css("z-index", 200);
          $cardNeutral.css("z-index", 200);
          $dragger.css("z-index", 201);
          let x = e.pageX || e.originalEvent.touches[0].pageX;
          pullDeltaX = x - startX;
          let y = e.pageY || e.originalEvent.touches[0].pageY;
          pullDeltaY = y - startY;
          if (!pullDeltaX && !pullDeltaY) return;
          pullChange();
        });

        $(document).on("mouseup touchend", function () {
          $(document).off("mousemove touchmove mouseup touchend");
          if (!pullDeltaX && !pullDeltaY) return;
          release();
        });
      }
    );
    $("#dismiss").click(function () {
      releaseClick(0);
    });
    $("#like").click(function () {
      releaseClick(2);
    });
    $("#skip").click(function () {
      releaseClick(1);
    });

    $buttonBack.click(function () {
      if ($buttonBack.hasClass("disabled")) return;
      if (animating) return;
      animating = true;
      questionIndex--;
      cardsCounter--;
      $card = $("#card" + (cardsCounter + 1));
      $card.removeClass("hide");
      const val = questionResults[questionIndex]["answer"];
      if (val == 0) $card.addClass("from-left");
      else if (val == 1) $card.addClass("from-top");
      else if (val == 2) $card.addClass("from-right");
      $card.addClass("inactive2");
      setTimeout(function () {
        if (val == 0) $card.addClass("from-leftanim");
        else if (val == 1) $card.addClass("from-topanim");
        else if (val == 2) $card.addClass("from-rightanim");
      }, 1);
      setTimeout(function () {
        if (val == 0) $card.removeClass("inactive2 from-left from-leftanim");
        else if (val == 1) $card.removeClass("inactive2 from-top from-topanim");
        else if (val == 2)
          $card.removeClass("inactive2 from-right from-rightanim");
        animating = false;
        updateNavigate();
      }, 800);
    });
    $buttonForward.click(function () {
      if ($buttonForward.hasClass("disabled")) return;
      if (animating) return;
      releaseClick(questionResults[questionIndex]["answer"]);
    });
  };

  calculationDone = function (count) {
    setExpandListeners();
    for (let i = 0; i < count; i++) {
      $("#resultbar" + i).css(
        "margin-left",
        "calc(" + $("#title" + i).width() + "px" + ")"
      );
      $("#resultbar" + i).width(
        "calc((100% - " +
          $("#title" + i).width() +
          "px" +
          ") * " +
          $("#resultbar" + i).data("ref") / 100 +
          ")"
      );
    }
  };

  setExpandListeners = function () {
    for (let i = 1; i < numberofCards + 1; i++) {
      $("#questionitem" + i).click(function () {
        $("#subquestionitem" + i).toggleClass("show");
        $("#questionarrow" + i).toggleClass("spin");
      });
    }
  };
  showCalculatingText = function () {
    $parentDIVDOM.html(
      "<div class='flex center itemcenter'><p>Ergebnis wird ermittelt...</p></div>"
    );
  };
  calculateResult = function () {
    showCalculatingText();
    let calc = [];
    parties.forEach((element) => {
      calc.push([0, 0]);
    });
    let grundetat = 0;
    for (let i = 0; i < this.questionResults.length; i++) {
      if (this.questionResults[i]["answer"] == 1) continue;
      for (let j = 0; j < parties.length; j++) {
        if (answers[j][i]["short_answer"] == questionResults[i]["answer"]) {
          if (this.questionResults[i]["double"]) {
            calc[j][0] += 2;
            calc[j][1] += 2;
            grundetat += 2;
          } else {
            calc[j][0] += 1;
            calc[j][1] += 1;
            grundetat += 1;
          }
        } else {
          if (this.questionResults[i]["double"]) {
            calc[j][0] -= 2;
            calc[j][1] += 2;
            grundetat += 2;
          } else {
            calc[j][0] -= 1;
            calc[j][1] += 1;
            grundetat += 1;
          }
        }
      }
    }
    for (let i = 0; i < calc.length; i++) {
      const subarray = calc[i];
      for (let j = 0; j < subarray.length; j++) {
        subarray[j] += grundetat;
        if (subarray[j] < 0) subarray[j] = 0;
      }
    }
    let finalResult = [];
    for (let i = 0; i < parties.length; i++) {
      finalResult.push({
        party: parties[i],
        value: ((calc[i][0] / calc[i][1]) * 100).toFixed(1),
      });
    }
    finalResult.sort((a, b) => a["value"] - b["value"]);
    showResult(finalResult);
    showAnswers();
    calculationDone(finalResult.length);
  };

  showResult = function (results) {
    let applyHTML = `<h1 class="textcenter">Ergebnis</h1>`;
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      applyHTML +=
        `<div class="resultbar">
        <div class="resultbar-title"><span id="title` +
        i +
        `">` +
        element["party"] +
        `</span></div>
        <div class="resultbar-bar" id="resultbar` +
        i +
        `" data-ref="` +
        element["value"] +
        `"></div>
        <div class="resultbar-percent">` +
        element["value"] +
        `%</div>
    </div>`;
    }
    $parentDIVDOM.html(applyHTML);
  };

  showAnswers = function () {
    let applyHTML = `<h1 style="text-align: center;">Antworten auf Fragen</h1>
    <div class="questionanswers">`;
    for (let i = 0; i < questions.length; i++) {
      applyHTML +=
        `<div class="questionitem" id="questionitem` +
        (i + 1) +
        `">
              <p style="margin-right: 60px;">Frage ` +
        (i + 1) +
        `: ` +
        questions[i]["question"] +
        `</p>
            <p class="chevron down questionchevron" id="questionarrow` +
        (i + 1) +
        `"></p>
        </div>
        <div class="subquestionitem" id="subquestionitem` +
        (i + 1) +
        `">`;
      for (let j = 0; j < parties.length; j++) {
        applyHTML +=
          ` <div class="subquestionitemhalf">
          <h2 class="itemtext text1">` +
          parties[j] +
          `</h2>
          <p class="itemtext text2">Antwort: ` +
          (answers[j][i]["short_answer"] == 2 ? "JA" : "NEIN") +
          `</p>
          <h3 class="itemtext text3" >Begründung:</h3>
          <p class="itemtext text4">` +
          answers[j][i]["long_answer"].replace("\n", "<br>") +
          `</p>
          <div class="transparentbg"></div>
        </div>`;
        if (j != parties.length - 1)
          applyHTML += '<div class="seperatorvertical"></div>';
      }
      applyHTML += "</div>";
    }
    $parentDIVDOM.append(applyHTML);
  };
}
