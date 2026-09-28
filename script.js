/* =========================================
   QUEUELESS
   Digital Queue Management System
   ========================================= */


/* DEFAULT QUEUE */

const defaultQueue = [

    {
        token: 100,
        name: "Walk-in",
        service: "General Enquiry"
    },

    {
        token: 101,
        name: "Walk-in",
        service: "Fees / Accounts"
    },

    {
        token: 102,
        name: "Walk-in",
        service: "Admissions"
    }

];


/* APPLICATION STATE */

let state = {

    current: 100,

    next: 103,

    queue: [...defaultQueue],

    served: [],

    mine: null

};


/* ELEMENT HELPER */

function $(id) {

    return document.getElementById(id);

}


/* SAVE DATA */

function saveState() {

    localStorage.setItem(
        "queuelessState",
        JSON.stringify(state)
    );

}


/* LOAD DATA */

function loadState() {

    const saved =
        localStorage.getItem(
            "queuelessState"
        );

    if (saved) {

        state = JSON.parse(saved);

    }

}


/* PEOPLE AHEAD */

function peopleAhead() {

    if (state.mine === null) {

        return null;

    }


    const index =
        state.queue.findIndex(
            person =>
                person.token === state.mine
        );


    if (index === -1) {

        return 0;

    }


    return index;

}


/* ESTIMATED WAIT */

function estimatedWait() {

    const ahead =
        peopleAhead();

    if (ahead === null) {

        return null;

    }


    /*
        Demo assumption:
        approximately 5 minutes
        per person.
    */

    return ahead * 5;

}


/* RENDER EVERYTHING */

function render() {

    renderHeader();

    renderCustomer();

    renderAdmin();

    saveState();

}


/* HEADER */

function renderHeader() {

    $("heroCurrent").textContent =
        "A-" + state.current;

}


/* CUSTOMER */

function renderCustomer() {

    const ahead =
        peopleAhead();

    const wait =
        estimatedWait();


    if (state.mine !== null) {

        $("myToken").textContent =
            "A-" + state.mine;

        $("ahead").textContent =
            ahead;

        $("wait").textContent =
            wait + " min";


        if (ahead === 0) {

            $("myStatus").textContent =
                "NEXT";

            $("turnNotice").className =
                "notice success";

            $("turnNotice").textContent =
                "🔔 It’s your turn! Please proceed to Counter 1.";

        }

        else {

            $("myStatus").textContent =
                "WAITING";

            $("turnNotice").className =
                "notice";

            $("turnNotice").textContent =
                "⏳ You are " +
                ahead +
                " place(s) away. Estimated wait: " +
                wait +
                " minutes.";

        }

    }

    else {

        $("myToken").textContent =
            "—";

        $("ahead").textContent =
            "—";

        $("wait").textContent =
            "—";

        $("myStatus").textContent =
            "—";

        $("turnNotice").className =
            "notice";

        $("turnNotice").textContent =
            "Join a queue to receive a token.";

    }


    $("queueCount").textContent =
        state.queue.length +
        " WAITING";


    $("customerQueue").innerHTML =
        createQueueHTML();

}


/* ADMIN */

function renderAdmin() {

    $("adminCurrent").textContent =
        "A-" + state.current;


    $("adminWaiting").textContent =
        state.queue.length;


    $("servedCount").textContent =
        state.served.length;


    $("adminQueue").innerHTML =
        createQueueHTML();


    renderHistory();

}


/* QUEUE HTML */

function createQueueHTML() {

    if (state.queue.length === 0) {

        return `
            <div class="notice success">
                ✓ Queue is currently empty.
            </div>
        `;

    }


    return state.queue.map(
        (person, index) => {

            const isMine =
                person.token === state.mine;

            const status =
                index === 0
                    ? "NOW SERVING"
                    : "WAITING";


            return `

                <div class="queue-row">

                    <div>

                        <strong>
                            A-${person.token}
                        </strong>

                        ${isMine ? " • You" : ""}

                        <br>

                        <span class="muted">
                            ${person.service}
                        </span>

                    </div>

                    <span class="pill">
                        ${status}
                    </span>

                </div>

            `;

        }
    ).join("");

}


/* HISTORY */

function renderHistory() {

    if (state.served.length === 0) {

        $("history").innerHTML = `
            <p class="muted">
                No completed tokens yet.
            </p>
        `;

        return;

    }


    $("history").innerHTML =
        state.served
            .slice()
            .reverse()
            .map(
                person => `

                    <div class="queue-row">

                        <div>

                            <strong>
                                A-${person.token}
                            </strong>

                            <br>

                            <span class="muted">
                                ${person.service}
                            </span>

                        </div>

                        <span class="pill">
                            SERVED
                        </span>

                    </div>

                `
            )
            .join("");

}


/* JOIN QUEUE */

function joinQueue() {

    const service =
        $("service").value;


    const token =
        state.next;


    state.next++;


    const customer = {

        token: token,

        name: "You",

        service: service

    };


    state.queue.push(
        customer
    );


    state.mine =
        token;


    $("customerMessage").innerHTML = `

        <div class="notice success">

            ✓ Token

            <strong>
                A-${token}
            </strong>

            generated successfully.

        </div>

    `;


    render();

}


/* CALL NEXT */

function callNext() {

    if (state.queue.length === 0) {

        alert(
            "The queue is already empty."
        );

        return;

    }


    const served =
        state.queue.shift();


    state.served.push(
        served
    );


    state.current =
        served.token;


    render();

}


/* RESET */

function resetDemo() {

    const confirmed =
        confirm(
            "Reset the Queueless demo?"
        );


    if (!confirmed) {

        return;

    }


    state = {

        current: 100,

        next: 103,

        queue: [...defaultQueue],

        served: [],

        mine: null

    };


    $("customerMessage").innerHTML =
        "";


    render();

}


/* CUSTOMER PAGE */

function showCustomer() {

    $("customerView")
        .classList
        .remove("hidden");


    $("adminView")
        .classList
        .add("hidden");


    $("customerNav")
        .classList
        .add("active");


    $("adminNav")
        .classList
        .remove("active");

}


/* ADMIN PAGE */

function showAdmin() {

    $("customerView")
        .classList
        .add("hidden");


    $("adminView")
        .classList
        .remove("hidden");


    $("customerNav")
        .classList
        .remove("active");


    $("adminNav")
        .classList
        .add("active");

}


/* EVENT LISTENERS */

$("joinBtn")
    .addEventListener(
        "click",
        joinQueue
    );


$("callNext")
    .addEventListener(
        "click",
        callNext
    );


$("resetBtn")
    .addEventListener(
        "click",
        resetDemo
    );


$("customerNav")
    .addEventListener(
        "click",
        showCustomer
    );


$("adminNav")
    .addEventListener(
        "click",
        showAdmin
    );


/* START */

loadState();

render();
