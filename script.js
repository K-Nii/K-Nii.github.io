"use strict";
// 1行目に記載している 'use strict' は削除しないでください
let leaveCounter = 0;

window.onload = function () {
  // 業務開始保存処理
  $(".start").on("click", function () {
    if (checkStatus.work()) {
      const date = getDate();
      const wokingTime = { status: "work", start: date };
      localStorage.setItem(
        localStorage.length.toString(),
        JSON.stringify(wokingTime)
      );
    }
    showStatus();
    showList();
  });

  // 離業開始保存処理
  $(".leave-start").on("click", function () {
    if (checkStatus.start()) {
      leaveCounter++;
      const currentIndex = localStorage.length - 1;
      const startTime = getTime();
      const workingTime = JSON.parse(
        localStorage.getItem(localStorage.key(currentIndex))
      );

      if (workingTime["status"] !== "work") {
        window.alert("始めにStartを押して業務を開始してください");
      } else {
        workingTime["leaveStart" + leaveCounter] = startTime;
        workingTime["status"] = "break time";

        localStorage.removeItem(localStorage.key(currentIndex));
        localStorage.setItem(
          currentIndex.toString(),
          JSON.stringify(workingTime)
        );
      }

      showStatus();
      showList();
    }
  });

  // 離業終了保存処理
  $(".leave-end").on("click", function () {
    if (checkStatus.start() & checkStatus.leave()) {
      const currentIndex = localStorage.length - 1;
      const endTime = getTime();
      const workingTime = JSON.parse(
        localStorage.getItem(localStorage.key(currentIndex))
      );
      workingTime["leaveEnd" + leaveCounter] = endTime;
      workingTime["status"] = "work";

      localStorage.removeItem(localStorage.key(currentIndex));
      localStorage.setItem(
        currentIndex.toString(),
        JSON.stringify(workingTime)
      );
    }

    showStatus();
    showList();
  });

  // 終了時間保存処理
  $(".end").on("click", function () {
    if (checkStatus.start() & checkStatus.leaveBack()) {
      leaveCounter = 0;
      const currentIndex = localStorage.length - 1;
      const endTime = getTime();
      const workingTime = JSON.parse(
        localStorage.getItem(localStorage.key(currentIndex))
      );
      workingTime["end"] = endTime;
      workingTime["status"] = "non-business hours";
      localStorage.removeItem(localStorage.key(currentIndex));
      localStorage.setItem(
        currentIndex.toString(),
        JSON.stringify(workingTime)
      );
    }

    showStatus();
    showList();
  });

  // リスト削除処理
  $(".delete").on("click", function () {
    if (checkStatus.nonBusiness()) {
      localStorage.clear();
      showList();
    }
  });
  showStatus();
  showList();
};

// ステータスを判定して表示する関数
function showStatus() {
  if (localStorage.key(localStorage.length - 1) !== null) {
    const status = localStorage.getItem(
      localStorage.key(localStorage.length - 1)
    );
    if (JSON.parse(status)["status"] === "non-business hours") {
      $(".status").removeClass("status-in");
      $(".status").removeClass("status-leave");
      $(".status").text("non-buisiness hours...");
    } else if (JSON.parse(status)["status"] === "break time") {
      $(".status").removeClass("status-in");
      $(".status").addClass("status-leave");
      $(".status").text("break time...");
    } else if (JSON.parse(status)["status"] === "work") {
      $(".status").removeClass("status-leave");
      $(".status").addClass("status-in");
      $(".status").text("working!!");
    }
  }
}

// ローカルストレージに保存された時間をリストにして表示する関数
function showList() {
  $("#list").html("");
  $("#leave-list").html("");
  for (let i = 0; i < localStorage.length; i++) {
    const workingTime = JSON.parse(localStorage.getItem(localStorage.key(i)));
    const leaveCount = Object.keys(workingTime).length - 1;
    let start = workingTime["start"];
    let end = workingTime["end"];
    start = defineCheck(start);
    end = defineCheck(end);

    $("#list").append(
      "<li class='list-items'><ul class=list-group id=leave-list" +
        i +
        ">" +
        start +
        "-" +
        end +
        "</ul></li><hr class='list-bar' />"
    );

    for (let j = 1; j <= leaveCount; j++) {
      let leaveStart = workingTime["leaveStart" + j];
      let leaveEnd = workingTime["leaveEnd" + j];
      leaveStart = defineCheck(leaveStart);
      leaveEnd = defineCheck(leaveEnd);
      if (workingTime["leaveStart" + j] !== undefined) {
        const currentId = "#leave-list" + i;
        $(currentId).append(
          "<li class='leave-list-items'>&nbsp;Leave time " +
            leaveStart +
            "-" +
            leaveEnd +
            "</li>"
        );
      }
    }
  }
}
const month = {
  Jun: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

// 日時を得る関数
function getDate() {
  const now = new Date();
  const yyyy = now.toDateString().slice(-4);
  const mm = month[now.toDateString().slice(4, 7)];
  const dd = now.toDateString().slice(8, 10);
  const time = now.toTimeString().slice(0, 5);

  return yyyy + "/" + mm + "/" + dd + " " + time;
}

// 時間のみ得る関数
function getTime() {
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  return time;
}

// 定義がなければ空白を返す関数
function defineCheck(str) {
  if (str === undefined) {
    str = "";
  }
  return str;
}

const checkStatus = {
  start: function () {
    const status = JSON.parse(
      localStorage.getItem(localStorage.key(localStorage.length - 1))
    );
    if (status === null) {
      window.alert("始めにStartボタンを押して業務を開始してください");
      return false;
    }
    return true;
  },
  work: function () {
    const status = JSON.parse(
      localStorage.getItem(localStorage.key(localStorage.length - 1))
    );
    if (status === null) {
      return true;
    } else if (status["status"] !== "non-business hours") {
      window.alert("すでに業務を開始しています");
      return false;
    } else {
      return true;
    }
  },
  leave: function () {
    const status = JSON.parse(
      localStorage.getItem(localStorage.key(localStorage.length - 1))
    );
    if (status["status"] !== "break time") {
      window.alert("先にLeaveボタンを押して離業を開始してください");
      return false;
    } else {
      return true;
    }
  },
  leaveBack: function () {
    const status = JSON.parse(
      localStorage.getItem(localStorage.key(localStorage.length - 1))
    );
    if (status["status"] === "break time") {
      window.alert("先にBackボタンを押して離業を終了してください");
      return false;
    } else {
      return true;
    }
  },
  nonBusiness: function () {
    const status = JSON.parse(
      localStorage.getItem(localStorage.key(localStorage.length - 1))
    );
    if (status === null) {
      window.alert("勤務時間が記録されていません");
    } else if (status["status"] !== "non-business hours") {
      window.alert("業務を終了してから削除してください");
      return false;
    } else {
      return true;
    }
  },
};
