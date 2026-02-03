import { useState } from "react";

const topics = [
  {
    id: "this",
    title: "this Keyword",
    icon: "⚡",
    color: "#e8533f",
    cards: [
      {
        front: "Regular fn vs Arrow fn — this rule",
        back: "Regular functions → this based on CALL-SITE (how it's called)\nArrow functions → this based on LEXICAL SCOPE (where it's created)"
      },
      {
        front: "Priority order of this",
        back: "1. new          → fresh object (HIGHEST)\n2. bind/call/apply → what you set\n3. obj.method()  → obj\n4. fn()          → undefined (strict) / window (sloppy)\n5. Arrow fn      → lexical (no own this)"
      },
      {
        front: "What is call-site?",
        back: "The exact place where a function is CALLED.\nnot where it's defined.\n\nobj.greet()  → call-site is obj\ngreet()      → call-site is nothing (bare)\nnew Greet()  → call-site is new"
      },
      {
        front: "What is lexical scope?",
        back: "Where the function is WRITTEN in the code.\nArrow functions grab this from the nearest surrounding FUNCTION's lexical scope.\n\nObject literals, blocks, loops = invisible. Only functions count."
      },
      {
        front: "Where does lexical scope EXIST?",
        back: "✅ Regular functions   → function greet() {}\n✅ Method shorthand   → { greet() {} }\n✅ Constructors       → function Person() {}\n✅ Class methods      → class Dog { bark() {} }"
      },
      {
        front: "Where does lexical scope NOT exist?",
        back: "❌ Object literals    → const obj = { ... }\n❌ if/else blocks     → if (true) { ... }\n❌ for/while loops    → for (...) { ... }\n❌ switch blocks      → switch { ... }\n❌ Arrow functions    → () => { ... }\n❌ Standalone blocks  → { ... }"
      },
      {
        front: "The destructuring trap",
        back: "const { greet } = obj;\ngreet();  // this = undefined!\n\nExtracting a method kills its connection to obj.\nIt becomes a bare function call.\nFix: bind it → obj.greet.bind(obj)"
      },
      {
        front: "The setTimeout trap",
        back: "setTimeout(function() {\n  this.x;  // ❌ bare call → undefined\n}, 100);\n\nFix: use arrow function\nsetTimeout(() => {\n  this.x;  // ✅ grabs this from outer fn\n}, 100);"
      },
      {
        front: "bind() vs call() vs apply()",
        back: "bind()   → returns a NEW function, this is LOCKED forever\ncall()   → calls IMMEDIATELY, pass args one by one\napply()  → calls IMMEDIATELY, pass args as ARRAY\n\nES6 spread made apply() mostly unnecessary.\nfn.call(ctx, ...args) = fn.apply(ctx, args)"
      },
      {
        front: "Can you re-bind a bound function?",
        back: "NO.\n\nconst b1 = fn.bind({ name: 'A' });\nconst b2 = b1.bind({ name: 'B' });\nb2();  // still 'A'\n\nOnce locked by bind, it's locked forever.\nOnly new can override bind."
      },
      {
        front: "new vs bind — who wins?",
        back: "new ALWAYS wins.\n\nconst Bound = Person.bind({ name: 'Forced' });\nconst p = new Bound('Venky');\np.name  // 'Venky' — new created fresh object\n\nPriority: new > bind > call/apply > method > bare"
      },
      {
        front: "Arrow fn in object literal trap",
        back: "const obj = {\n  name: 'Venky',\n  greet: () => this.name  // ❌ undefined\n};\n\nobj is NOT a scope. Arrow skips it.\nGrabs this from global.\n\nFix: use regular function or method shorthand\ngreet() { return this.name; }  // ✅"
      }
    ]
  },
  {
    id: "scope",
    title: "Scope & Closures",
    icon: "🔍",
    color: "#3a7bd5",
    cards: [
      {
        front: "What is scope?",
        back: "The zone where a variable can be accessed.\n\nTwo types:\n• Block scope  → let, const (inside { } only)\n• Function scope → var (hoisted to nearest function)"
      },
      {
        front: "var vs let vs const — scope",
        back: "var   → function scoped. Leaks out of blocks.\nlet   → block scoped. Stays inside { }.\nconst → block scoped + can't reassign.\n\nif (true) {\n  var x = 1;   // leaks out\n  let y = 2;   // stays inside\n}\nconsole.log(x); // 1\nconsole.log(y); // ReferenceError"
      },
      {
        front: "What is the scope chain?",
        back: "When JS looks up a variable, it starts at the current scope, then walks UP through parent scopes until it finds it or hits global.\n\nInner functions can see outer variables.\nOuter functions CANNOT see inner variables."
      },
      {
        front: "What is a closure?",
        back: "A function that REMEMBERS variables from its outer scope, even after the outer function has finished running.\n\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst c = makeCounter(); // done running\nc(); // 1 — count still alive!"
      },
      {
        front: "The classic closure bug",
        back: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Logs: 3, 3, 3 ← NOT 0, 1, 2\n\nWhy? var i is shared across all iterations.\nBy the time setTimeout runs, i = 3.\n\nFix: use let\nfor (let i = 0; ...) → logs 0, 1, 2"
      },
      {
        front: "Does this get captured by closures?",
        back: "NO.\n\nthis is NOT a variable. It's decided fresh every time a function is called.\n\nClosures capture VARIABLES (let, const, var).\nthis is decided by CALL-SITE rules, not closure."
      }
    ]
  },
  {
    id: "hoisting",
    title: "Hoisting",
    icon: "🏗️",
    color: "#f39c12",
    cards: [
      {
        front: "What is hoisting?",
        back: "Before running code, JS scans and moves DECLARATIONS to the top of their scope.\n\nBut WHAT gets hoisted differs:\n• var → declaration hoisted, value is NOT\n• let/const → hoisted but NOT initialized (TDZ)\n• function declaration → FULLY hoisted (name + body)\n• function expression → only var is hoisted"
      },
      {
        front: "var hoisting",
        back: "console.log(x); // undefined (not error!)\nvar x = 5;\n\nJS sees it as:\nvar x;           // hoisted\nconsole.log(x);  // undefined\nx = 5;           // assignment stays here"
      },
      {
        front: "let/const — TDZ",
        back: "console.log(y); // ReferenceError!\nlet y = 10;\n\nTDZ = Temporal Dead Zone\nThe gap between scope start and declaration.\nAccessing variable in TDZ = crash."
      },
      {
        front: "Function declaration vs expression",
        back: "// Declaration → fully hoisted\nconsole.log(add(1,2)); // 3 ✅\nfunction add(a,b) { return a+b; }\n\n// Expression → only var hoisted\nconsole.log(mul(1,2)); // TypeError ❌\nvar mul = function(a,b) { return a*b; }"
      },
      {
        front: "Declaration vs Expression priority",
        back: "console.log(foo()); // 'declaration'\nfunction foo() { return 'declaration'; }\nvar foo = function() { return 'expression'; };\n\nWhy? Function declarations hoist FIRST and FULLY.\nvar foo already exists so declaration doesn't overwrite.\nExpression assignment hasn't run yet."
      }
    ]
  }
];

export default function App() {
  const [activeTopic, setActiveTopic] = useState("this");
  const [flipped, setFlipped] = useState({});
  const [filter, setFilter] = useState("");

  const topic = topics.find(t => t.id === activeTopic);
  const filtered = topic.cards.filter(c =>
    c.front.toLowerCase().includes(filter.toLowerCase()) ||
    c.back.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleFlip = (i) => setFlipped(prev => ({ ...prev, [activeTopic + i]: !prev[activeTopic + i] }));

  return (
    <div style={{ minHeight: "100vh", background: "#08090c", color: "#d4d8e0", fontFamily: "'Courier New', monospace" }}>
      {/* Header */}
      <div style={{
        background: "#0c0e12", borderBottom: "1px solid #1e2128",
        padding: "1rem 1.5rem", textAlign: "center"
      }}>
        <p style={{ color: "#444", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "3px", margin: "0 0 0.3rem" }}>
          Quick Reference — Peek Anytime
        </p>
        <h1 style={{ color: "#fff", fontSize: "1.1rem", margin: 0, fontFamily: "Georgia, serif", fontWeight: 400 }}>
          JS Engine Memory Cards
        </h1>
      </div>

      {/* Topic Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", padding: "1rem", background: "#0a0b0e", borderBottom: "1px solid #1e2128" }}>
        {topics.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTopic(t.id); setFilter(""); }}
            style={{
              background: activeTopic === t.id ? t.color + "18" : "transparent",
              border: `1px solid ${activeTopic === t.id ? t.color + "55" : "#1e2128"}`,
              color: activeTopic === t.id ? t.color : "#666",
              padding: "0.45rem 1rem", borderRadius: "6px", cursor: "pointer",
              fontSize: "0.75rem", fontFamily: "'Courier New', monospace",
              transition: "all 0.2s"
            }}
          >
            {t.icon} {t.title}
            <span style={{ color: "#333", marginLeft: "0.4rem" }}>{t.cards.length}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ maxWidth: "700px", margin: "1rem auto", padding: "0 1rem" }}>
        <input
          type="text"
          placeholder="🔍 search cards..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            width: "100%", padding: "0.5rem 0.75rem", background: "#0c0e12",
            border: "1px solid #1e2128", borderRadius: "6px", color: "#aaa",
            fontSize: "0.78rem", fontFamily: "'Courier New', monospace",
            outline: "none", boxSizing: "border-box"
          }}
        />
      </div>

      {/* Cards Grid */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1rem 2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {filtered.map((card, i) => {
          const key = activeTopic + i;
          const isFlipped = flipped[key];
          return (
            <div
              key={key}
              onClick={() => toggleFlip(i)}
              style={{
                background: isFlipped ? "#0f1a1a" : "#0c0e12",
                border: `1px solid ${isFlipped ? topic.color + "33" : "#1e2128"}`,
                borderRadius: "10px", cursor: "pointer", overflow: "hidden",
                transition: "all 0.2s", minHeight: "100px"
              }}
            >
              {/* Card Header */}
              <div style={{
                padding: "0.7rem 1rem",
                borderBottom: isFlipped ? `1px solid ${topic.color}22` : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: isFlipped ? topic.color + "0a" : "transparent"
              }}>
                <span style={{
                  fontSize: "0.82rem", color: isFlipped ? topic.color : "#ccc",
                  fontFamily: "Georgia, serif", fontWeight: isFlipped ? 400 : 600
                }}>
                  {card.front}
                </span>
                <span style={{ color: "#333", fontSize: "0.7rem" }}>{isFlipped ? "▲ tap to hide" : "▼ tap to reveal"}</span>
              </div>

              {/* Answer */}
              {isFlipped && (
                <div style={{ padding: "0.85rem 1rem" }}>
                  {card.back.split("\n").map((line, j) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith("✅") || trimmed.startsWith("❌")) {
                      return (
                        <div key={j} style={{
                          fontSize: "0.76rem", lineHeight: 1.9,
                          color: trimmed.startsWith("✅") ? "#2ecc71" : "#e74c3c",
                          fontFamily: "'Courier New', monospace"
                        }}>{trimmed}</div>
                      );
                    }
                    if (trimmed.startsWith("Fix:") || trimmed.startsWith("Why?") || trimmed.startsWith("TDZ")) {
                      return (
                        <div key={j} style={{
                          fontSize: "0.74rem", color: "#f39c12", marginTop: "0.3rem",
                          padding: "0.25rem 0.5rem", background: "#1a1500",
                          borderRadius: "3px", borderLeft: "2px solid #f39c12"
                        }}>{trimmed}</div>
                      );
                    }
                    if (line.startsWith("  ") || line.startsWith("  ")) {
                      return (
                        <div key={j} style={{
                          fontSize: "0.74rem", color: "#7ec8e3", lineHeight: 1.8,
                          fontFamily: "'Courier New', monospace",
                          background: "#0a0c10", padding: "0.08rem 0.5rem", borderRadius: "2px"
                        }}>{line}</div>
                      );
                    }
                    return (
                      <div key={j} style={{
                        fontSize: trimmed === "" ? "0" : "0.78rem",
                        color: "#999", lineHeight: 1.7, height: trimmed === "" ? "0.5rem" : "auto",
                        fontFamily: "Georgia, serif"
                      }}>{trimmed}</div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#333", padding: "2rem", fontSize: "0.8rem" }}>
            No cards match that search.
          </div>
        )}
      </div>
    </div>
  );
}
