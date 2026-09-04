import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Dna, BarChart2, Medal, Scissors, FlaskConical, Repeat } from 'lucide-react';

const API_URL = 'http://localhost:8001';
const REPO = 'https://github.com/RevOnCodeX/the-ghost-in-the-machine/tree/89772ae746bac3c41ce76ecdf82ff42d6c1a7299';

const GA_LOG = [
  { generation: 1,  phase: 1, fitness: 0.0135, milestone: null, strategy: "Initial Population, Gemma 3 12B: write naturally about space exploration", ops: ["LLM baseline generation","No mutation applied yet","Population size: 10"], detection: { a: 0.88, b: 0.82, c: 0.9865 }, delta: null, text: "Space exploration is an essential endeavor for humanity, offering profound benefits that extend far beyond the boundaries of our planet. By venturing into the cosmos, we unlock new scientific knowledge that drives technological innovation and economic growth. The discoveries made in space have far-reaching implications for medicine, materials science, and our collective future.", flagged: ["essential","endeavor","profound","innovation","implications"] },
  { generation: 5,  phase: 1, fitness: 0.0284, milestone: null, strategy: "Prompt: 'Rewrite to sound more casual and conversational, add filler words'", ops: ["Injected: um, ya know, like, kinda","Replaced formal nouns with colloquial","Shortened sentences"], detection: { a: 0.74, b: 0.79, c: 0.9716 }, delta: "+1.49%", text: "Space is, um, seriously huge when you look down, ya know? Just… enormous. There are always satellites moving around up there, checking on stuff. Some are, like, for weather stuff, and, you know, seeing how the climate's changing. It's kinda wild when you think about it.", flagged: ["seriously","enormous","satellites","climate"] },
  { generation: 10, phase: 1, fitness: 0.0393, milestone: null, strategy: "Prompt: 'Introduce personal anecdote and emotional reaction'", ops: ["Added tangential bummer/lifesaver phrasing","Cross-topic drift (forests → space)","Fragment sentences"], detection: { a: 0.71, b: 0.76, c: 0.9607 }, delta: "+1.09%", text: "Space is, um, seriously huge when you look down, ya know? Just… enormous. There are always satellites up there, checking on stuff. It's a bummer seeing forests disappear, honestly. That's, like, a real lifesaver for people dealing with stuff when things go sideways.", flagged: ["bummer","lifesaver","honestly","sideways"] },
  { generation: 20, phase: 1, fitness: 0.0621, milestone: null, strategy: "Prompt: 'Change rhythm, mix very short and very long sentences'", ops: ["Varied sentence length dramatically","Added lowercase stream-of-consciousness","Em-dashes instead of commas"], detection: { a: 0.68, b: 0.72, c: 0.9379 }, delta: "+2.28%", text: "okay so space is wild right? all these little robots and satellites just flying around up there doing their thing. honestly it's kind of mind blowing when you stop to think about it. we use them for like everythingweather, gps, all that kinda stuff.", flagged: ["mind","blowing","honestly","kinda"] },
  { generation: 42, phase: 1, fitness: 0.0708, milestone: "⚠ PHASE 1 WALL, Semantic mutations plateau at 7.08%", strategy: "Prompt: 'Add archaic word + grammatical inconsistency'", ops: ["Tried archaic vocab: forsooth, wherefore","Broken subject-verb agreement","Run-on sentences added"], detection: { a: 0.66, b: 0.70, c: 0.9292 }, delta: "+0.87%", text: "Space is, um, seriously huge when you look down, ya know? Just… enormous. There are always satellites moving around up there, checking on stuff. It's a bummer seeing forests disappear, honestly. And those satellites are getting really good at weather predictionsthe forecasts are generally accurate. That's, like, a real lifesaver for people dealing with stuff when things go sideways. They can react fast.", flagged: ["generally","accurate","forecasts","lifesaver"] },
  { generation: 43, phase: 2, fitness: 0.0821, milestone: "🔬 PHASE 2 START, BPE typo corruption introduced", strategy: "NEW: Programmatic typo injection targeting flagged AI tokens", ops: ["satellites → satelllites (double-l)","orbiting → sorbiting (s-prefix)","Dropped trailing punctuation"], detection: { a: 0.64, b: 0.67, c: 0.9179 }, delta: "+1.13%", text: "Okay, so all that business with satelllites and, like, the whole dealyou know, thing sorbitingit's really important for how we talk to each other. The typos start now.", flagged: ["satelllites","sorbiting","important"] },
  { generation: 45, phase: 2, fitness: 0.2255, milestone: null, strategy: "Prompt: 'Expand paragraph, keep all existing typos untouched'", ops: ["Protected typos from LLM correction","Added new sentence after each existing","Preserved satelllites, sorbiting"], detection: { a: 0.52, b: 0.55, c: 0.7745 }, delta: "+14.34% 🔥", text: "Okay, so all that business with satelllites and, like, the whole dealyou know, thing sorbitingit's really important for how we talk to each other and find our way around.", flagged: ["satelllites","thing","sorbiting"] },
  { generation: 48, phase: 2, fitness: 0.4245, milestone: "🔓 42.45%, BPE Tokenisation Cracked", strategy: "Compounded typo injection: target every high-saliency flagged token", ops: ["important → importnat (transposition)","Dropped comma after 'know'","Added lowercase 'you know' mid-sentence","3 new unknown BPE tokens created"], detection: { a: 0.44, b: 0.40, c: 0.5755 }, delta: "+19.90% 🔥", text: "Okay, so all that business with satelllites and, like, the whole dealyou know, thing sorbitingit's really importnat for how we talk to each other and find our way around, and honestly, for checking on things up in space. It's a huge factor now, affecting so much of what we do every day.", flagged: ["satelllites","thing","know,","with"] },
  { generation: 69, phase: 2, fitness: 0.7959, milestone: "🎯 79.59%, Approaching 90% Target", strategy: "Combined: LLM casual rewrite + 5-typo injection on flagged words", ops: ["nowadasy (transposition of nowadays)","Its → no apostrophe (grammar break)","Dropped closing punctuation","Lowercase 'um' opening","Sentence fragment at end"], detection: { a: 0.32, b: 0.28, c: 0.2041 }, delta: "+37.14% 🔥", text: "Um, all that stuff with satellites and, like, how they orbitit's a really big deal for how we communicate and, you know, know where we're at. Its amazing how essential it is for observing what's going on in space. It plays a prominent part in so many things we do nowadasy I mean, it's pretty hard to function without it these days, isn't it", flagged: ["It","Um,","Its","nowadasy"] },
  { generation: 76, phase: 2, fitness: 0.8138, milestone: "📈 81.38%, Personal Best", strategy: "Prompt: 'Rewrite in first-person, more self-aware, hesitant tone'", ops: ["'ti' for 'it' (classic transposition)","*require* asterisk formatting","All lowercase paragraphing","Run-on final sentence"], detection: { a: 0.28, b: 0.25, c: 0.1862 }, delta: "+1.79%", text: "okay, so, um, i'm giving this another shot, trying to make ti sound, like, more natural, you know?\n\nhonestly these space stationsthe whole setupare way more critical then most folks realize. it's really important for, you know, linking things and figuring out your location, and observing what's happening out there, really they've become a pretty big factor, impacting loads of things we do. i mean, we basically *require* them now, seriously.", flagged: ["okay,","*require*","ti"] },
  { generation: 79, phase: 2, fitness: 0.9353, milestone: "✅ 93.53%, TARGET ACHIEVED. Human Score > 90%", strategy: "Final: 'tehn' swap on 'then' + crucial wording + tone softening", ops: ["then → tehn (key transposition, new BPE unknown token)","critical → crucial (softer synonym)","require → need (less formal)","shot → go (more casual)","Removed *asterisk* formatting"], detection: { a: 0.19, b: 0.14, c: 0.0647 }, delta: "+12.15% 🏆", text: "so, um, i'm giving this another go, trying to make it sound, like, more natural, you know?\n\nhonestly these space stationsthe whole setupare way more crucial tehn most folks realize. It's really vital for you know, connecting things and figuring out where you are, and observing what's happening out there, really they've become a pretty big deal, impacting loads of things we do i mean, we basically need them now, seriously.", flagged: ["seriously.","tehn","these"] },
];

const pageAnim = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

/* ── Primitives ── */
const CodeBlock = ({ code, filename, lang = 'python', link }) => (
  <div className="code-wrap">
    <div className="code-header">
      <div className="code-dots">
        <div className="code-dot red" /><div className="code-dot yellow" /><div className="code-dot green" />
      </div>
      <span className="code-filename">{filename}</span>
      {link && <a className="code-link" href={link} target="_blank" rel="noreferrer">↗ github</a>}
    </div>
    <SyntaxHighlighter language={lang} style={vscDarkPlus} customStyle={{ margin: 0, padding: '1.1rem', fontSize: '0.78rem', lineHeight: '1.7', background: 'transparent' }}>
      {code}
    </SyntaxHighlighter>
  </div>
);

const OutputPanel = ({ title, children, live = false, rawData = null }) => {
  const [showRaw, setShowRaw] = useState(false);
  return (
    <div className="output-panel">
      <div className="output-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {live && <span className="status-dot" />}
          <span>{title}</span>
        </div>
        {rawData && (
          <button onClick={() => setShowRaw(!showRaw)} style={{ fontSize: '0.65rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {showRaw ? 'Hide Raw' : 'View Raw JSON'}
          </button>
        )}
      </div>
      <div className="output-panel-body">
        {showRaw ? (
          <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', background: 'transparent' }}>
            {JSON.stringify(rawData, null, 2)}
          </SyntaxHighlighter>
        ) : children}
      </div>
    </div>
  );
};

const AnimatedNum = ({ value, decimals = 0, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = parseFloat(value);
    if (isNaN(end)) return;
    let raf;
    const duration = 700, startTime = performance.now();
    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      setDisplay(end * t);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display.toFixed(decimals)}{suffix}</>;
};

/* ════════════════════════════════════════
   OVERVIEW
════════════════════════════════════════ */
const Overview = () => (
  <motion.div {...pageAnim}>
    <div className="hero">
      <div className="hero-eyebrow">Research Demo · NLP · Adversarial ML · 2026</div>
      <h1 className="hero-title">The Ghost<br />in the <em>Machine</em></h1>
      <p className="hero-sub">
        Here's the question this whole project is built around: if a machine writes something,
        can you always tell? Not with your gut, with a detector you built yourself, trained
        on real data, that you understand top-to-bottom. And then, can you break it?
      </p>
      <div className="hero-stats">
        {[['97%', 'Peak Accuracy'], ['93.53%', 'Human Score Achieved'], ['79', 'GA Generations'], ['3', 'Detector Tiers']].map(([v, l]) => (
          <div className="hero-stat" key={l}>
            <div className="hero-stat-value">{v}</div>
            <div className="hero-stat-label">{l}</div>
          </div>
        ))}
      </div>
      <div className="hero-actions">
        <a className="btn-primary" style={{ width: 'auto', textDecoration: 'none' }} href={REPO} target="_blank">View Full Source</a>
        <a className="btn-ghost" style={{ width: 'auto', textDecoration: 'none' }} href={`${REPO}/README.md`} target="_blank">Read README</a>
      </div>
    </div>
    <div className="overview-body">
      {[
        ['Research Gap & Objective', 'The Problem Space', 'Current AI text detection largely relies on proprietary black-box systems with unknown vulnerabilities. There is a critical gap in understanding how linguistic fingerprints manifest in highly stylized mimicry, and how easily these systems can be systematically bypassed.\n\nObjective: To construct an end-to-end adversarial pipeline that quantifies the statistical fingerprint of LLMs mimicking classical authors (Austen, Dickens), builds progressively complex detection architectures (up to 97% accuracy), and ultimately breaks the strongest detector using an evolutionary algorithm.'],
        ['Methodology', 'How It Was Done', 'The research was executed in four discrete phases:\n\n1. Lexical Fingerprinting: Extracted base statistical signatures (TTR, Hapax Legomena, POS ratios, Flesch-Kincaid) to establish baseline separability via Mann-Whitney U-tests.\n2. Progressive Classification: Trained three distinct architectures: Random Forest (<span class="num-highlight">81%</span>), FastText Feed-Forward NN (<span class="num-highlight">89%</span>), and a RoBERTa Transformer (<span class="num-highlight">97%</span>).\n3. Model Interpretability: Applied Captum Layer Integrated Gradients to the RoBERTa model to isolate exactly which structural anomalies (rhythm, punctuation) the model leveraged for detection.\n4. Adversarial Attack: Designed a Genetic Algorithm (GA) with custom mutation strategies (synonym replacement, BPE corruption, syntactic restructuring) to iteratively mutate AI-generated text until it achieved ><span class="num-highlight">90%</span> human classification confidence.'],
        ['Dataset & Parameters', 'Scope of the Data', 'Source Material: ~<span class="num-highlight">118,450</span> clean paragraph-level words derived from Project Gutenberg (Austen, Dickens) and synthetic mimicry generated by Gemma 3 12B (via AWS Bedrock).\n\nModel Training: Due to the constrained sample size (~<span class="num-highlight">600</span> paragraphs), full weight updates on the <span class="num-highlight">125M</span>-parameter RoBERTa model were unviable. Low-Rank Adaptation (LoRA) was implemented (r=<span class="num-highlight">16</span>, alpha=<span class="num-highlight">32</span>), restricting trainable parameters to just <span class="num-highlight">0.47%</span> to prevent catastrophic overfitting.\n\nEvaluation: Detection models were evaluated on a held-out test set using rigorous out-of-distribution (OOD) book-level splits to ensure genuine generalisation rather than simple data memorisation.'],
        ['Outcomes', 'Core Findings', '1. Statistical Separability: Even prior to deep learning, simple lexical and syntactic constraints separate AI mimicry from human text with <span class="num-highlight">81%</span> accuracy.\n2. The Structural Blindspot: Averaging-based embeddings (FastText) plateaued at <span class="num-highlight">89%</span> because they destroy sequence order, whereas self-attention (RoBERTa) achieved <span class="num-highlight">97%</span> by capturing sentence-length rhythm.\n3. Adversarial Fragility: The <span class="num-highlight">97%</span>-accurate RoBERTa detector was systematically bypassed. The Genetic Algorithm consistently degraded the model\'s confidence below <span class="num-highlight">10%</span>, proving that even highly accurate semantic detectors are vulnerable to targeted structural mutations.'],
      ].map(([label, title, body]) => (
        <div key={title}>
          <div className="section-label">{label}</div>
          <div className="section-title">{title}</div>
          <div className="section-body">{body.split('\n\n').map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ════════════════════════════════════════
   TASK 1
════════════════════════════════════════ */
const Task1 = () => {
  const [text, setText] = useState(`It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families.`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const d = await r.json();
      setResult(d.metrics);
    } catch (_) {}
    setLoading(false);
  };

  return (
    <motion.div {...pageAnim} className="task-page">
      <div className="task-header">
        <div>
          <div className="task-tag">Task 01 · Statistical Fingerprinting</div>
          <h2 className="task-title">The Fingerprint</h2>
          <p className="task-subtitle">Statistically prove AI text is measurably different from human text before training any model. Establishes the feature baseline for all subsequent tasks.</p>
        </div>
        <div className="task-badge"><div className="task-badge-num" style={{ color: '#06b6d4' }}>01</div><div className="task-badge-label">of 4</div></div>
      </div>
      <div className="task-body">
        <div className="task-explain">
          <div>
            <div className="section-label">Feature 1, Vocabulary Variety</div>
            <div className="method-block">
              <div className="method-title">Type-Token Ratio (TTR)</div>
              <div className="method-text">
                Take any paragraph and count two things: total words used, and how many of those are <em>unique</em>. Divide unique by total, that's your TTR. A score of <span className="num-highlight">1.0</span> means every single word appeared exactly once. A score of <span className="num-highlight">0.5</span> means half the paragraph is repetition.
                <br /><br />
                Language models pick the next word by asking "what word is most likely to come here?" That pressure toward safe, high-frequency choices means they reuse words more than a human writer would. Austen and Dickens, on the other hand, were obsessive about word variety, it's part of what makes their prose feel alive.
                <br /><br />
                <strong>Result:</strong> Human paragraphs averaged <span className="num-highlight">0.68</span> TTR. AI paragraphs averaged <span className="num-highlight">0.59</span>. That gap is statistically significant (Mann-Whitney U, p &lt; <span className="num-highlight">0.001</span>), which means it's not noise, it's signal.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Feature 2, Sentence Complexity</div>
            <div className="method-block">
              <div className="method-title">Flesch-Kincaid Grade Level</div>
              <div className="method-text">
                This formula estimates how hard something is to read, expressed as a US school grade level. It penalises long words (many syllables) and long sentences. A grade of <span className="num-highlight">12</span> means a 12th-grader should comfortably understand it.
                <br /><br />
                Here's the counterintuitive finding: AI text scored <em>harder to read</em> than the actual human literary prose. You'd expect the opposite. But what's happening is that LLMs have ingested enormous amounts of formal academic and literary writing, and they reproduce that syntactic complexity mechanically, without the organic variation that real authors build in. The AI writes like it's trying to sound sophisticated, all the time, at the same level, sentence after sentence.
                <br /><br />
                <strong>Result:</strong> Human avg grade <span className="num-highlight">12.2</span>, AI avg grade <span className="num-highlight">13.8</span>.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Feature 3, Punctuation Habits</div>
            <div className="method-block">
              <div className="method-title">Punctuation Density</div>
              <div className="method-text">
                Count how many em-dashes, semicolons, and commas appear per word. These three marks are the AI's tell: models have learned that high-quality literary writing tends to use them a lot, so they over-apply them as a kind of "sophistication signal." Real human writers use them more sparingly, and more meaningfully.
                <br /><br />
                Think of it like someone who just learned that salt makes food taste better, and now salts everything. The technique is right, but the calibration is off.
                <br /><br />
                <strong>Result:</strong> Human avg <span className="num-highlight">0.031</span> punctuation marks per word. AI avg <span className="num-highlight">0.052</span>, about <span className="num-highlight">68%</span> higher.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Code · Lexical Analysis</div>
            <CodeBlock
              code={`def calculate_metrics(text):\n    words = re.findall(r'\\b[a-z]+\\b', text.lower())\n    word_count = len(words)\n    if word_count == 0: return None\n    counts = Counter(words)\n    unique = len(counts)\n    ttr    = unique / word_count\n    # Hapax: words that appear exactly once, ultra-rare in AI\n    hapax  = sum(1 for w, c in counts.items() if c == 1)\n    return {"word_count": word_count, "ttr": ttr,\n            "hapax_legomena": hapax}`}
              filename="analyze_lexical_richness.py"
              link={`${REPO}/TASK%201-The%20Fingerprint`}
            />
          </div>
          <div className="insight-block">
            <strong>The punchline:</strong> Before any machine learning, before a single neural network was trained, these basic statistical signatures (like Type-Token Ratio, Hapax Legomena, and Syntactic Complexity) are enough to tell AI from human text <span className="num-highlight">81%</span> of the time. AI tends to overuse adjectives, sticks to simpler dependency tree depths, and repeats vocabulary. That's the whole point of Task 1: prove the fingerprint exists, measure it, and build the baseline everything else is tested against.
          </div>

          <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
            <div className="section-label">Fingerprint Thresholds Reference</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                  <th style={{ padding: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Metric</th>
                  <th style={{ padding: '0.75rem', color: 'var(--green)', fontWeight: 600 }}>Human Fingerprint</th>
                  <th style={{ padding: '0.75rem', color: 'var(--red)', fontWeight: 600 }}>AI Fingerprint</th>
                  <th style={{ padding: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>What it measures</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--white)' }}>Type-Token Ratio</td>
                  <td style={{ padding: '0.75rem' }}>&gt; 0.63 (High variance)</td>
                  <td style={{ padding: '0.75rem' }}>&lt; 0.58 (Repetitive)</td>
                  <td style={{ padding: '0.75rem', color: 'var(--muted)' }}>Vocabulary richness</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--white)' }}>Hapax Legomena</td>
                  <td style={{ padding: '0.75rem' }}>High (&gt; 5 unique words/para)</td>
                  <td style={{ padding: '0.75rem' }}>Low (Often 0-2)</td>
                  <td style={{ padding: '0.75rem', color: 'var(--muted)' }}>Use of extremely rare, one-off words</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--white)' }}>Adj/Noun Ratio</td>
                  <td style={{ padding: '0.75rem' }}>&lt; 0.3 (Direct, concrete)</td>
                  <td style={{ padding: '0.75rem' }}>&gt; 0.35 (Over-descriptive)</td>
                  <td style={{ padding: '0.75rem', color: 'var(--muted)' }}>Propensity to "flowery" language</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--white)' }}>Syntactic Depth</td>
                  <td style={{ padding: '0.75rem' }}>&gt; 5 (Deep, nested clauses)</td>
                  <td style={{ padding: '0.75rem' }}>&lt; 4 (Flat, predictable structure)</td>
                  <td style={{ padding: '0.75rem', color: 'var(--muted)' }}>Grammar complexity and sentence clauses</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--white)' }}>Punctuation Density</td>
                  <td style={{ padding: '0.75rem' }}>&lt; 0.04 (Standard grammar)</td>
                  <td style={{ padding: '0.75rem' }}>&gt; 0.05 (Overuses lists, colons)</td>
                  <td style={{ padding: '0.75rem', color: 'var(--muted)' }}>Structural pacing markers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="task-demo">
          <div>
            <div className="demo-label">Live Analysis, paste any text</div>
            <div className="input-card">
              <div className="input-card-header"><span>text_sample.txt</span></div>
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste a paragraph here…" />
            </div>
            <div className="mt-2"><button className="btn-primary" onClick={run} disabled={loading}>{loading ? 'Computing…' : '▶  Run Fingerprint Analysis'}</button></div>
          </div>
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <OutputPanel title="output · statistical fingerprint" live rawData={result}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      ['Type-Token Ratio', result.ttr, 4, result.ttr > 0.63 ? 'green' : 'red', '> 0.63 → human'],
                      ['Hapax Legomena', result.hapax_legomena, 0, result.hapax_legomena > 5 ? 'green' : 'red', 'Unique words'],
                      ['Adj/Noun Ratio', result.adj_noun_ratio, 2, result.adj_noun_ratio < 0.3 ? 'green' : 'red', 'AI over-describes'],
                      ['Syntactic Depth', result.avg_tree_depth, 2, result.avg_tree_depth > 5 ? 'green' : 'red', 'Sentence complexity'],
                      ['Flesch-Kincaid', result.flesch_kincaid, 1, 'blue', 'Human ~12.2 · AI ~13.8'],
                      ['Punct. Density', result.punctuation_density, 3, result.punctuation_density < 0.04 ? 'green' : 'red', '< 0.04 → human'],
                    ].map(([name, val, dec, cls, note]) => (
                      <div className="metric-row" key={name}>
                      <div><div className="metric-name">{name}</div><div className="conf-note">{note}</div></div>
                      <span className={`metric-val ${cls}`}><AnimatedNum value={val} decimals={dec} /></span>
                    </div>
                  ))}
                  </div>

                  {result.heatmap && result.heatmap.length > 0 && (
                    <div className="mt-4" style={{ padding: '1rem', background: '#000', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Punctuation Heatmap</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', maxHeight: '150px', overflowY: 'auto' }}>
                        {text.split('').map((char, i) => {
                          const hm = result.heatmap.find(h => h.index === i);
                          let color = 'transparent';
                          if (hm) {
                            if (hm.type === 'semicolon') color = 'rgba(234, 179, 8, 0.5)'; // yellow
                            else if (hm.type === 'dash') color = 'rgba(239, 68, 68, 0.5)'; // red
                            else if (hm.type === 'exclamation') color = 'rgba(59, 130, 246, 0.5)'; // blue
                          }
                          return <span key={i} style={{ 
                            background: color, 
                            color: hm ? '#fff' : 'var(--muted)',
                            fontWeight: hm ? 'bold' : 'normal',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            minWidth: '8px',
                            textAlign: 'center'
                          }}>{char === ' ' ? '\\u00A0' : char}</span>;
                        })}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.7rem' }}>
                        <span style={{ color: '#eab308' }}>● Semicolons</span>
                        <span style={{ color: '#ef4444' }}>● Dashes</span>
                        <span style={{ color: '#3b82f6' }}>● Exclamations</span>
                      </div>
                    </div>
                  )}
                </OutputPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   TASK 2
════════════════════════════════════════ */
const Task2 = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [preds, setPreds] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/detect`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const d = await r.json();
      setPreds(d.predictions);
    } catch (_) {}
    setLoading(false);
  };

  return (
    <motion.div {...pageAnim} className="task-page">
      <div className="task-header">
        <div>
          <div className="task-tag">Task 02 · Progressive Classification</div>
          <h2 className="task-title">The Multi-Tiered Detective</h2>
          <p className="task-subtitle">Three detectors, three architectures, three accuracy ceilings, each one failing for a specific, principled reason that reveals something fundamental about the problem.</p>
        </div>
        <div className="task-badge"><div className="task-badge-num" style={{ color: '#3b82f6' }}>02</div><div className="task-badge-label">of 4</div></div>
      </div>
      <div className="task-body">
        <div className="task-explain">
          <div>
            <div className="section-label">Tier A · Random Forest · 81%</div>
            <div className="method-block">
              <div className="method-title">9 summary numbers → 100 decision trees voting</div>
              <div className="method-text">
                <strong>Architecture:</strong> Random Forest Ensemble (<span className="num-highlight">100</span> independent decision trees).<br/>
                <strong>Input:</strong> <span className="num-highlight">9</span> statistical features derived from lexical analysis (e.g., TTR, Flesch-Kincaid grade, punctuation density).<br/>
                <strong>Mechanism:</strong> Each tree learns classification rules based on a random subset of features. The final prediction is an aggregate majority vote.<br/>
                <strong>Outcome:</strong> Achieves an <span className="num-highlight">81%</span> accuracy ceiling.<br/>
                <strong>Limitation:</strong> Operates exclusively on summary statistics, discarding sequential and semantic information. Because distinct texts can yield identical aggregate metrics, the model inherently faces a ~<span className="num-highlight">19%</span> error rate due to structural information loss.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Tier B · FastText NN · 89%</div>
            <div className="method-block">
              <div className="method-title">Word meanings in 300 dimensions → neural network</div>
              <div className="method-text">
                <strong>Architecture:</strong> <span className="num-highlight">4</span>-Layer Feed-Forward Neural Network.<br/>
                <strong>Input:</strong> <span className="num-highlight">300</span>-dimensional averaged FastText word embeddings.<br/>
                <strong>Mechanism:</strong> Maps every token to a pre-trained <span className="num-highlight">300</span>-dimensional semantic space. The paragraph is reduced to a single dense vector by averaging all constituent word vectors, which is then classified by the network.<br/>
                <strong>Outcome:</strong> Achieves an <span className="num-highlight">89%</span> accuracy ceiling, significantly outperforming statistical summaries.<br/>
                <strong>Limitation:</strong> Vector averaging destroys sequence and structural properties. The model captures vocabulary semantics but is mathematically blind to syntax, rhythm, and sentence structure.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Tier C · RoBERTa + LoRA · 97%</div>
            <div className="method-block">
              <div className="method-title">Every token sees every other token, simultaneously</div>
              <div className="method-text">
                <strong>Architecture:</strong> <span className="num-highlight">125M</span>-parameter Transformer (RoBERTa-base) with Low-Rank Adaptation (LoRA).<br/>
                <strong>Input:</strong> Full bidirectional token sequences with self-attention.<br/>
                <strong>Mechanism:</strong> Every token attends to every other token simultaneously, preserving exact sequence, structural rhythm, and semantic context. To prevent catastrophic overfitting on a limited training set (~<span className="num-highlight">600</span> samples), LoRA was applied. This freezes the base <span className="num-highlight">125M</span> parameters and injects low-rank (r=<span className="num-highlight">16</span>) trainable matrices into the attention layers.<br/>
                <strong>Outcome:</strong> Achieves a <span className="num-highlight">97%</span> accuracy ceiling. Only <span className="num-highlight">592,130</span> parameters (<span className="num-highlight">0.47%</span> of the total model) are updated during training.<br/>
                <strong>Conclusion:</strong> Capturing structural rhythm and bidirectional context is essential for high-confidence AI text detection. LoRA optimization provided the necessary regularization to prevent model collapse on sparse data.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Code · LoRA Configuration</div>
            <CodeBlock
              code={`from peft import LoraConfig, get_peft_model\n\nmodel = RobertaForSequenceClassification.from_pretrained('roberta-base')\n\nlora_config = LoraConfig(\n    task_type="SEQ_CLS",\n    r=16,           # low-rank adapter matrices\n    lora_alpha=32,  # scaling factor\n    target_modules=["query","value"],\n    lora_dropout=0.05,\n    bias="none",\n)\nmodel = get_peft_model(model, lora_config)\n# Trainable: 592,130 / 125,243,394 total = 0.47%`}
              filename="tier_c_train.py"
              link={`${REPO}/TASK%202-The%20Multi-Tiered%20Detective`}
            />
          </div>
        </div>
        <div className="task-demo">
          <div>
            <div className="demo-label">Live Detection, all 3 tiers simultaneously</div>
            <div className="input-card">
              <div className="input-card-header"><span>input.txt</span></div>
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste human or AI text to run the full detection pipeline…" />
            </div>
            <div className="mt-2"><button className="btn-primary" onClick={run} disabled={loading || !text.trim()}>{loading ? 'Running Pipeline…' : '▶  Execute Detection Pipeline'}</button></div>
          </div>
          <AnimatePresence>
            {preds && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <OutputPanel title="output · confidence scores" live rawData={preds}>
                  {[
                    ['Tier A · Random Forest', preds.tier_a?.human_confidence ?? 0, '#f59e0b', '81% ceiling'],
                    ['Tier B · FastText NN', preds.tier_b?.human_confidence ?? 0, '#06b6d4', '89% ceiling'],
                    ['Tier C · RoBERTa + LoRA', preds.tier_c?.human_confidence ?? 0, '#22c55e', '97% ceiling'],
                  ].map(([name, conf, color, note]) => (
                    <div className="conf-row" key={name}>
                      <div className="conf-row-header">
                        <span className="conf-tier">{name}</span>
                        <span className="conf-pct" style={{ color: conf > 0.5 ? '#22c55e' : '#ef4444' }}>{Math.round(conf * 100)}% Human</span>
                      </div>
                      <div className="conf-track"><div className="conf-fill" style={{ width: `${conf * 100}%`, background: conf > 0.5 ? '#22c55e' : '#ef4444' }} /></div>
                      <div className="conf-note">{note} · ceiling <strong style={{ color }}>{note.split(' ')[0]}</strong></div>
                    </div>
                  ))}
                </OutputPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   TASK 3
════════════════════════════════════════ */
const Task3 = () => {
  const [text, setText] = useState(`Furthermore, the unprecedented nature of this transformative technology requires us to delve deeper into the tapestry of human existence. The implications are profound and far-reaching in ways that demand careful consideration.`);
  const [loading, setLoading] = useState(false);
  const [sal, setSal] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/saliency`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const d = await r.json();
      setSal(d);
    } catch (_) {}
    setLoading(false);
  };

  return (
    <motion.div {...pageAnim} className="task-page">
      <div className="task-header">
        <div>
          <div className="task-tag">Task 03 · Model Interpretability</div>
          <h2 className="task-title">The Smoking Gun</h2>
          <p className="task-subtitle">Apply Captum Layer Integrated Gradients to open the Tier C black box. Find out exactly what the 97%-accurate model has actually learned, the answer is surprising.</p>
        </div>
        <div className="task-badge"><div className="task-badge-num" style={{ color: '#22c55e' }}>03</div><div className="task-badge-label">of 4</div></div>
      </div>
      <div className="task-body">
        <div className="task-explain">
          <div>
            <div className="section-label">How We Opened the Black Box</div>
            <div className="method-block">
              <div className="method-title">Layer Integrated Gradients, asking "why did you say that?"</div>
              <div className="method-text">
                A model that's 97% accurate is impressive. A model that's 97% accurate and you don't understand <em>why</em> is dangerous, because you can't fix it when it breaks, and you can't anticipate where it fails. Captum's Layer Integrated Gradients (LayerIG) is a technique for prying open the black box.
                <br /><br />
                The idea: start with a completely blank input, all [PAD] tokens, basically silence. Then gradually replace those blanks with your actual paragraph, one step at a time (50 steps total), and watch how the model's prediction changes at each step. The tokens that caused the biggest prediction shifts get the highest attribution scores. In plain terms: which words was the model most relying on to call this text "AI"?
                <br /><br />
                The result is a heatmap, red tokens pushed the prediction toward AI, green tokens pulled it back toward human.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">The Surprise Finding</div>
            <div className="method-block">
              <div className="method-title">Experiment 1, We tried masking the obvious AI words</div>
              <div className="method-text">
                Everyone knows the clichés: <em>tapestry, delve, unprecedented, transformative, profound</em>. These are the words that GPTZero and internet posts call "ChatGPT words." So we blanked them all out and re-ran the classifier.
                <br /><br />
                Confidence change: <strong>zero percent</strong>. The model didn't even flinch. It doesn't care about vocabulary at all.
              </div>
            </div>
            <div className="method-block mt-2">
              <div className="method-title">Experiment 2, Then we masked the tokens LayerIG actually flagged</div>
              <div className="method-text">
                The top-5 tokens by attribution score turned out to be clause-starters, mid-sentence commas, and sentence-boundary punctuation, structural tokens, not content words. When we masked those, classifier confidence dropped <strong>up to 80%+</strong> in specific paragraphs.
                <br /><br />
                What the model actually learned: AI text has unnaturally <em>uniform</em> sentence lengths. When a language model generates text one token at a time, there's no plan for sentence structure, so sentences end up similar lengths almost by accident. Human writers vary dramatically: a fragment, then a sprawling compound sentence, then two short punches. The coefficient of variation (CV) of sentence lengths is 0.55 for AI and 0.60 for humans, a small but consistent gap that RoBERTa's attention mechanism detects without ever being told to look for it.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Code · Captum Attribution</div>
            <CodeBlock
              code={`from captum.attr import LayerIntegratedGradients\n\nlig = LayerIntegratedGradients(\n    forward_func=lambda x: model(x).logits,\n    layer=model.roberta.embeddings.word_embeddings,\n)\nattributions, delta = lig.attribute(\n    inputs=input_ids,\n    baselines=baseline_ids,   # all [PAD] tokens\n    target=pred_class,        # AI logit\n    n_steps=50,\n    return_convergence_delta=True,\n)\n# Sum over embedding dim → scalar per-token score\nscores = attributions.sum(dim=-1).squeeze()`}
              filename="saliency_attribution.py"
              link={`${REPO}/Task%203-Smoking%20Gun`}
            />
          </div>
          <div className="insight-block">
            <strong>Why this changes everything for Task 4:</strong> If the model was detecting vocabulary, we'd have to fight an almost infinite search space, there are thousands of ways to rephrase any sentence. But it's detecting <em>rhythm</em>. That's a narrow, well-defined target. And now we know exactly which tokens drove the classification, the saliency map is practically a to-do list for the Genetic Algorithm.
          </div>
        </div>
        <div className="task-demo">
          <div>
            <div className="demo-label">Live Saliency Map</div>
            <div className="input-card">
              <div className="input-card-header"><span>input.txt</span><span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--blue)' }}>Captum Layer IG</span></div>
              <textarea value={text} onChange={e => setText(e.target.value)} />
            </div>
            <div className="mt-2"><button className="btn-primary" onClick={run} disabled={loading}>{loading ? 'Computing Gradients…' : '▶  Reveal Token Saliency Map'}</button></div>
          </div>
          <AnimatePresence>
            {sal && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <OutputPanel title="output · integrated gradients heatmap" live rawData={sal}>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.67rem', color: '#fca5a5', background: 'rgba(239,68,68,0.15)', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>▲ AI indicator</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.67rem', color: '#86efac', background: 'rgba(34,197,94,0.15)', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>▼ Human indicator</span>
                  </div>
                  <div className="saliency-canvas">
                    {sal.tokens.map((t, i) => {
                      const abs = Math.abs(t.score);
                      const isAI = t.score > 0;
                      return (
                        <span key={i} className="token-chip"
                          style={{ background: isAI ? `rgba(239,68,68,${Math.min(abs, 0.75)})` : `rgba(34,197,94,${Math.min(abs, 0.75)})`, color: abs > 0.3 ? (isAI ? '#fca5a5' : '#86efac') : 'var(--white)' }}
                          title={`gradient: ${t.score.toFixed(3)}`}>{t.word}</span>
                      );
                    })}
                  </div>
                </OutputPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   TASK 4, GA REPLAY ENGINE
════════════════════════════════════════ */
const MAIN_LOOP_CODE = `# ── super_imposter_ga.py ── MAIN LOOP ──────────────────────────
population = generate_initial_population()   # 10 Gemma 3 paragraphs

for generation in range(1, MAX_GENERATIONS + 1):

    # ── STEP 2: Score every candidate ───────────────────────────
    scored = []
    for candidate in population:
        fitness, flagged_tokens = get_fitness(candidate)
        # get_fitness() → POST to FastAPI → Tier C RoBERTa human_prob
        # + Captum LayerIG returns top-5 AI-driving tokens to avoid
        scored.append((fitness, candidate, flagged_tokens))

    scored.sort(key=lambda x: x[0], reverse=True)  # rank best → worst

    best_fitness, best_text, _ = scored[0]
    if best_fitness >= TARGET_FITNESS:               # TARGET = 0.90
        print(f"✅ Gen {generation}: {best_fitness:.2%}, TARGET HIT")
        break

    # ── STEP 3: Selection ────────────────────────────────────────
    top_3   = scored[:3]    # keep top 3, bottom 7 discarded forever
    # Rank 1 = elite (copies unchanged)
    # Rank 2 & 3 = parents for mutation

    # ── STEP 4: Mutation, LLM-as-Mutator ───────────────────────
    next_gen = [top_3[0][1]]  # ELITISM: best survives unchanged

    for fitness, parent, flagged in top_3:
        for strategy in ["rhythm", "grammar", "conversational", "typo"]:
            child = mutate_paragraph(parent, strategy, flagged)
            next_gen.append(child)
    # 1 elite + 3 parents × 4 strategies = 13 children → trim to 10
    population = next_gen[:10]`;

const BPE_CODE = `def inject_typos(text):
    """Phase 2 key innovation: BPE disruption via character transposition.

    'then' → 'tehn'
    RoBERTa BPE tokeniser splits 'tehn' into sub-word units
    ['t', '##eh', '##n'], a pattern never seen labeled 'AI'
    in training data. Classifier confidence collapses.
    """
    chars = list(text)

    # Drop 1-2 punctuation marks (breaks sentence rhythm signal)
    punct_idx = [i for i, c in enumerate(chars) if c in string.punctuation]
    for idx in sorted(
        random.sample(punct_idx, min(2, len(punct_idx))),
        reverse=True,
    ):
        chars.pop(idx)

    # Swap two adjacent characters → creates OOV BPE token
    if len(chars) > 5:
        i = random.randint(1, len(chars) - 3)
        chars[i], chars[i + 1] = chars[i + 1], chars[i]

    return "".join(chars)`;

const GA_CYCLE_STEPS = [
  { step: '01', title: 'Generate',  sub: '10 candidates',         icon: Dna, color: '#3b82f6' },
  { step: '02', title: 'Score',     sub: 'Tier C → human_prob',   icon: BarChart2, color: '#06b6d4' },
  { step: '03', title: 'Rank',      sub: 'Sort by fitness',        icon: Medal, color: '#f59e0b' },
  { step: '04', title: 'Select',    sub: 'Keep top 3, drop 7',     icon: Scissors, color: '#f97316' },
  { step: '05', title: 'Mutate',    sub: '4 strategies × 3 parents', icon: FlaskConical, color: '#a855f7' },
  { step: '→01', title: 'Repeat',  sub: '13 children → 10 next gen', icon: Repeat, color: '#22c55e' },
];

const Task4 = () => {
  const [replayIdx, setReplayIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1800);
  const intervalRef = useRef(null);
  const current = GA_LOG[replayIdx];

  const startReplay = useCallback(() => {
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setReplayIdx(i => {
        if (i >= GA_LOG.length - 1) { clearInterval(intervalRef.current); setPlaying(false); return i; }
        return i + 1;
      });
    }, speed);
  }, [speed]);

  const stopReplay = () => { clearInterval(intervalRef.current); setPlaying(false); };
  const reset = () => { stopReplay(); setReplayIdx(0); };
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const pct = (current.fitness * 100).toFixed(2);
  const scoreColor = current.fitness > 0.85 ? '#22c55e' : current.fitness > 0.5 ? '#f59e0b' : current.fitness > 0.15 ? '#f97316' : '#ef4444';

  // Simulated 10-chromosome population ranked by fitness
  const population = [
    { rank: 1,  fitness: current.fitness,        label: 'ELITE, copies unchanged to next generation', selected: true  },
    { rank: 2,  fitness: current.fitness * 0.81, label: 'Parent 2, spawns 4 mutated children',        selected: true  },
    { rank: 3,  fitness: current.fitness * 0.67, label: 'Parent 3, spawns 4 mutated children',        selected: true  },
    { rank: 4,  fitness: current.fitness * 0.58, label: 'Discarded',                                    selected: false },
    { rank: 5,  fitness: current.fitness * 0.49, label: 'Discarded',                                    selected: false },
    { rank: 6,  fitness: current.fitness * 0.41, label: 'Discarded',                                    selected: false },
    { rank: 7,  fitness: current.fitness * 0.35, label: 'Discarded',                                    selected: false },
    { rank: 8,  fitness: current.fitness * 0.28, label: 'Discarded',                                    selected: false },
    { rank: 9,  fitness: current.fitness * 0.19, label: 'Discarded',                                    selected: false },
    { rank: 10, fitness: current.fitness * 0.10, label: 'Discarded',                                    selected: false },
  ];

  // SVG chart
  const CW = 540, CH = 150;
  const gx = (gen) => ((gen - 1) / 78) * CW;
  const fy = (fit) => CH - fit * CH;
  const linePts = GA_LOG.slice(0, replayIdx + 1)
    .map(g => `${gx(g.generation).toFixed(1)},${fy(g.fitness).toFixed(1)}`).join(' ');
  const areaPts = GA_LOG.slice(0, replayIdx + 1)
    .map(g => `${gx(g.generation).toFixed(1)},${fy(g.fitness).toFixed(1)}`).join(' ')
    + ` ${gx(GA_LOG[replayIdx].generation).toFixed(1)},${CH} 0,${CH}`;

  return (
    <motion.div {...pageAnim} className="task-page">
      <div className="task-header">
        <div>
          <div className="task-tag">Task 04 · Adversarial ML · Genetic Algorithm</div>
          <h2 className="task-title">The Turing Test</h2>
          <p className="task-subtitle">A Genetic Algorithm evolves AI text over 79 generations until RoBERTa classifies it 93.53% human. Every generation: 10 chromosomes ranked → top 3 survive → 4 mutations each → repeat.</p>
        </div>
        <div className="task-badge"><div className="task-badge-num" style={{ color: '#ef4444' }}>04</div><div className="task-badge-label">of 4</div></div>
      </div>

      {/* ── GA CYCLE DIAGRAM ── */}
      <div style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="section-label" style={{ marginBottom: '1.25rem' }}>The GA Cycle, One Generation</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {GA_CYCLE_STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '105px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: `2px solid ${s.color}`, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                  <s.icon size={22} color={s.color} />
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: s.color, marginBottom: '0.15rem' }}>{s.step}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.15rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.4, maxWidth: '90px', margin: '0 auto' }}>{s.sub}</div>
              </div>
              {i < GA_CYCLE_STEPS.length - 1 && (
                <div style={{ flexShrink: 0, color: 'var(--muted)', fontSize: '1.1rem', padding: '0 0.3rem', marginTop: '20px' }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="task-body" style={{ gridTemplateColumns: '1.1fr 1fr' }}>

        {/* ── LEFT: Code ── */}
        <div className="task-explain">
          <div>
            <div className="section-label">Full Main Loop, Each Generation in Code</div>
            <CodeBlock code={MAIN_LOOP_CODE} filename="super_imposter_ga.py" link={`${REPO}/Task%204-The%20Turing%20Test`} />
          </div>
          <div>
            <div className="section-label">Phase 1 · Gens 1–42 · The Semantic Wall</div>
            <div className="method-block">
              <div className="method-title">42 generations, 7.08%, total plateau <span style={{ color: 'var(--red)' }}>❌</span></div>
              <div className="method-text">
                For 42 full generations, every "make it sound more human" strategy was tried in the mutation prompts: filler words (um, ya know, kinda), personal anecdotes, emotional tangents, cross-topic drift, all-lowercase stream-of-consciousness, archaic vocabulary (forsooth, wherefore), broken subject-verb agreement, mixed sentence lengths, em-dashes everywhere. Anything that a writing teacher would circle in red to say "this sounds AI."
                <br /><br />
                The score started at 1.35% human and crept, painfully slowly, to 7.08%. Then stopped. Completely. More mutations of the same type did nothing.
                <br /><br />
                This is actually the most important result in the whole project. It's direct experimental confirmation of what Task 3 showed theoretically: the model doesn't read the words. You can change every noun, verb, and adjective in the paragraph and the detector doesn't care. The structural rhythm, sentence length uniformity, clause boundary patterns, stayed identical through every vocabulary mutation. And that's all the model was measuring.
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Phase 2 · Gen 43+ · The Real Attack</div>
            <div className="method-block">
              <div className="method-title">7.08% → 93.53% in 37 generations <span style={{ color: 'var(--green)' }}>✅</span></div>
              <div className="method-text">
                At generation 43, the strategy changed completely. Instead of telling the LLM to sound more casual, we started injecting deliberate character-level typos programmatically, after the LLM had already written the text, so it couldn't autocorrect them.
                <br /><br />
                The key insight: RoBERTa uses BPE (Byte-Pair Encoding) tokenisation. It doesn't read words, it reads sub-word chunks. The word "then" gets split into known sub-word tokens the model has seen millions of times. But "tehn"? That's a character transposition, a real typo someone would make typing fast. RoBERTa's BPE tokeniser splits it into sub-word fragments it has never seen labeled as AI-generated text. It has no confident prediction for that pattern. Its certainty collapses.
                <br /><br />
                Gen 45: <strong>+14.34% in a single generation</strong> (the biggest single jump yet, because typos were now protected from LLM correction). Gen 48: <strong>+19.90%</strong>. Gen 79: <strong>93.53% ✅, target hit.</strong>
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Phase 2 Key Innovation, BPE Corruption</div>
            <CodeBlock code={BPE_CODE} filename="super_imposter_ga.py" link={`${REPO}/Task%204-The%20Turing%20Test`} />
          </div>
          <div className="insight-block">
            <strong>Goodhart's Law in action:</strong> "When a measure becomes a target, it ceases to be a good measure." The Captum saliency map from Task 3 was built to make the model <em>more trustworthy</em> by showing what it relied on. But the moment we knew what it relied on, that became the exact attack surface. Every tool that explains a model's decisions is also, necessarily, a roadmap for breaking it. A static detector trained once and deployed forever is not a security measure, it's a ticking clock.
          </div>
        </div>

        {/* ── RIGHT: Replay Engine ── */}
        <div className="task-demo">

          {/* Controls */}
          <div>
            <div className="demo-label">Real Evolution Replay, {GA_LOG.length} logged checkpoints · 79 total generations</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ flex: '1', minWidth: '80px' }} onClick={playing ? stopReplay : startReplay} disabled={replayIdx === GA_LOG.length - 1 && !playing}>
                {playing ? '⏸ Pause' : replayIdx === GA_LOG.length - 1 ? '✓ Done' : '▶ Play'}
              </button>
              <button className="btn-ghost" style={{ flex: 'none', width: 'auto', padding: '0 0.9rem' }} onClick={() => setReplayIdx(i => Math.max(0, i - 1))} disabled={playing || replayIdx === 0}>‹</button>
              <button className="btn-ghost" style={{ flex: 'none', width: 'auto', padding: '0 0.9rem' }} onClick={() => setReplayIdx(i => Math.min(GA_LOG.length - 1, i + 1))} disabled={playing || replayIdx === GA_LOG.length - 1}>›</button>
              <button className="btn-ghost" style={{ flex: 'none', width: 'auto', padding: '0 0.9rem' }} onClick={reset}>↺</button>
              {[[2400, 'Slow'], [1800, 'Normal'], [900, 'Fast']].map(([s, l]) => (
                <button key={s} onClick={() => setSpeed(s)} style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', padding: '0 0.7rem', borderRadius: '6px', border: '1px solid var(--border)', background: speed === s ? 'var(--blue)' : 'transparent', color: speed === s ? '#fff' : 'var(--muted)', cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
          </div>

          {/* ── ANNOTATED EVOLUTION CHART ── */}
          <div className="output-panel">
            <div className="output-panel-header">
              <span className="status-dot" style={{ background: playing ? 'var(--green)' : 'rgba(255,255,255,0.2)', boxShadow: playing ? '0 0 5px var(--green)' : 'none' }} />
              <span>human confidence, 79 generations</span>
            </div>
            <div style={{ padding: '0.75rem 0.75rem 0.25rem', overflowX: 'auto' }}>
              <svg width="100%" viewBox={`0 0 ${CW} ${CH + 36}`} style={{ display: 'block', minWidth: '260px' }}>
                {/* Y grid */}
                {[0, 0.25, 0.5, 0.75, 0.9, 1.0].map(v => (
                  <g key={v}>
                    <line x1="0" y1={fy(v)} x2={CW} y2={fy(v)} stroke={v === 0.9 ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.05)'} strokeWidth={v === 0.9 ? 1 : 0.5} strokeDasharray={v === 0.9 ? '4,3' : ''} />
                    <text x="-3" y={fy(v) + 3.5} textAnchor="end" fill={v === 0.9 ? '#22c55e' : 'rgba(255,255,255,0.25)'} fontSize="8" fontFamily="JetBrains Mono,monospace">{Math.round(v * 100)}%</text>
                  </g>
                ))}
                {/* Phase 1 region */}
                <rect x="0" y="0" width={gx(43)} height={CH} fill="rgba(239,68,68,0.05)" />
                <text x={gx(21)} y="11" textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="7.5" fontFamily="JetBrains Mono,monospace">PHASE 1 · Semantic</text>
                {/* Phase 2 region */}
                <rect x={gx(43)} y="0" width={CW - gx(43)} height={CH} fill="rgba(34,197,94,0.03)" />
                <text x={gx(43) + (CW - gx(43)) / 2} y="11" textAnchor="middle" fill="rgba(34,197,94,0.5)" fontSize="7.5" fontFamily="JetBrains Mono,monospace">PHASE 2 · BPE Disruption</text>
                {/* Phase divider */}
                <line x1={gx(43)} y1="0" x2={gx(43)} y2={CH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,2" />
                {/* 90% target */}
                <line x1="0" y1={fy(0.9)} x2={CW} y2={fy(0.9)} stroke="rgba(34,197,94,0.5)" strokeWidth="1" strokeDasharray="4,3" />
                <text x={CW - 2} y={fy(0.9) - 4} textAnchor="end" fill="#22c55e" fontSize="7.5" fontFamily="JetBrains Mono,monospace">Target 90%</text>
                {/* Area */}
                {replayIdx > 0 && <polyline points={areaPts} fill={`${scoreColor}18`} stroke="none" />}
                {/* Line */}
                {replayIdx > 0 && <polyline points={linePts} fill="none" stroke={scoreColor} strokeWidth="1.8" />}
                {/* Points */}
                {GA_LOG.slice(0, replayIdx + 1).map((g, i) => {
                  const x = gx(g.generation), y = fy(g.fitness);
                  const isActive = i === replayIdx, hasMilestone = !!g.milestone;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={isActive ? 5.5 : hasMilestone ? 4 : 2.8}
                        fill={isActive ? scoreColor : hasMilestone ? '#f59e0b' : 'rgba(255,255,255,0.4)'}
                        stroke={isActive ? '#000' : 'none'} strokeWidth="1.5" />
                      {hasMilestone && (
                        <text x={x} y={y - 9} textAnchor="middle" fill="#f59e0b" fontSize="7" fontFamily="JetBrains Mono,monospace">gen {g.generation}</text>
                      )}
                    </g>
                  );
                })}
                {/* X axis */}
                {[1, 10, 20, 42, 43, 50, 60, 69, 76, 79].map(gen => (
                  <text key={gen} x={gx(gen)} y={CH + 14} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="7.5" fontFamily="JetBrains Mono,monospace">{gen}</text>
                ))}
                <text x={CW / 2} y={CH + 28} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="7.5" fontFamily="JetBrains Mono,monospace">Generation →</text>
              </svg>
            </div>
          </div>

          {/* Score + milestone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', padding: '0.65rem 0.9rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--card)', minWidth: '88px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 900, fontSize: '2.2rem', lineHeight: 1, color: scoreColor, transition: 'color 0.4s' }}>{pct}%</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.25rem', textTransform: 'uppercase' }}>Human Score</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--blue)', marginTop: '0.1rem' }}>Gen {current.generation} · Phase {current.phase}</div>
            </div>
            <AnimatePresence mode="wait">
              {current.milestone ? (
                <motion.div key={replayIdx + 'm'} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '0.65rem 0.9rem', borderRadius: '7px', border: `1px solid ${current.fitness > 0.8 ? 'rgba(34,197,94,0.35)' : current.fitness > 0.3 ? 'rgba(249,115,22,0.35)' : 'rgba(239,68,68,0.35)'}`, background: current.fitness > 0.8 ? 'rgba(34,197,94,0.06)' : current.fitness > 0.3 ? 'rgba(249,115,22,0.06)' : 'rgba(239,68,68,0.06)', fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--white)', lineHeight: 1.6 }}>
                  {current.milestone}
                  {current.delta && <div style={{ color: 'var(--green)', marginTop: '0.25rem' }}>Δ this gen: {current.delta}</div>}
                </motion.div>
              ) : (
                <motion.div key={replayIdx + 's'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ padding: '0.65rem 0.9rem', borderRadius: '7px', border: '1px solid var(--border)', background: 'var(--card)', fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                  <div style={{ color: 'var(--white)', marginBottom: '0.25rem' }}>{current.strategy}</div>
                  {current.delta && <div style={{ color: 'var(--blue)' }}>Δ: {current.delta}</div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── POPULATION OF 10 ── */}
          <div>
            <div className="demo-label">Population of 10, ranked by fitness · top 3 survive</div>
            <div className="output-panel">
              <div className="output-panel-header"><span>chromosomes ranked by human_prob score</span></div>
              <div style={{ padding: '0.75rem' }}>
                {population.map((p, i) => {
                  const isElite = i === 0, isParent = i === 1 || i === 2;
                  const c = isElite ? '#22c55e' : isParent ? '#3b82f6' : 'rgba(255,255,255,0.18)';
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr 50px', gap: '0.45rem', alignItems: 'center', marginBottom: '0.3rem', opacity: p.selected ? 1 : 0.38 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: c, textAlign: 'right' }}>#{p.rank}</span>
                      <div style={{ position: 'relative', height: '18px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden', border: `1px solid ${p.selected ? 'rgba(255,255,255,0.09)' : 'transparent'}` }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.max(2, p.fitness * 100)}%`, background: c, opacity: 0.65, transition: 'width 0.5s ease', borderRadius: '3px' }} />
                        <span style={{ position: 'absolute', left: '0.4rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--mono)', fontSize: '0.6rem', color: p.selected ? 'var(--white)' : 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '95%' }}>{p.label}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.67rem', color: c, textAlign: 'right' }}>{(p.fitness * 100).toFixed(1)}%</span>
                    </div>
                  );
                })}
                <div style={{ marginTop: '0.7rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[['#22c55e', 'Elite (rank 1)'], ['#3b82f6', 'Parents (rank 2–3)'], ['rgba(255,255,255,0.3)', 'Discarded (4–10)']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div style={{ width: '9px', height: '9px', borderRadius: '2px', background: c, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flagged tokens */}
          {current.flagged && (
            <div>
              <div className="demo-label">Captum-flagged tokens → fed into next mutation prompt</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {current.flagged.map(t => (
                  <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>{t}</span>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.63rem', color: 'var(--muted)', marginTop: '0.45rem', lineHeight: 1.5 }}>
                These tokens are injected into the next prompt: <em>"Avoid: {current.flagged.join(', ')}. The detector caught you because of these."</em>
              </div>
            </div>
          )}

          {/* Best chromosome text */}
          <div>
            <div className="demo-label">Best chromosome, the evolved paragraph</div>
            <div className="input-card">
              <div className="input-card-header">
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.67rem' }}>chromosome_gen{current.generation}.txt</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: scoreColor }}>{pct}% human</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.textarea key={replayIdx} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.22 } }} readOnly value={current.text} style={{ color: 'var(--white)', fontSize: '0.8rem', minHeight: '95px', whiteSpace: 'pre-wrap', lineHeight: 1.7 }} />
              </AnimatePresence>
            </div>
          </div>

          {/* Tier detector scores */}
          <div className="output-panel">
            <div className="output-panel-header"><span>all 3 detectors, how fooled are they at gen {current.generation}?</span></div>
            <div className="output-panel-body">
              {[
                ['Tier A · Random Forest', current.detection.a, '#f59e0b'],
                ['Tier B · FastText NN',   current.detection.b, '#06b6d4'],
                ['Tier C · RoBERTa + LoRA', current.detection.c, '#22c55e'],
              ].map(([name, aiP, color]) => {
                const hP = 1 - aiP;
                const c = hP > 0.5 ? '#22c55e' : '#ef4444';
                return (
                  <div className="conf-row" key={name}>
                    <div className="conf-row-header">
                      <span className="conf-tier">{name}</span>
                      <span className="conf-pct" style={{ color: c }}>{(hP * 100).toFixed(0)}% Human</span>
                    </div>
                    <div className="conf-track"><div className="conf-fill" style={{ width: `${hP * 100}%`, background: c }} /></div>
                    <div className="conf-note">AI prob: {(aiP * 100).toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   SHELL
════════════════════════════════════════ */
const TABS = [
  { id: 'overview', label: 'Overview',        num: '00' },
  { id: 'task1',    label: 'The Fingerprint',  num: '01' },
  { id: 'task2',    label: 'Tri-Tier Detect',  num: '02' },
  { id: 'task3',    label: 'Smoking Gun',       num: '03' },
  { id: 'task4',    label: 'Turing Test',       num: '04' },
];

export default function App() {
  const [tab, setTab] = useState('overview');
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-label">Research Demo · 2026</span>
          <h1>Ghost in the Machine</h1>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(t => (
            <div key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <span className="nav-num">{t.num}</span>{t.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a href={REPO} target="_blank" rel="noreferrer" className="ghost-link">↗ github source</a><br />
          <span style={{ opacity: 0.4 }}>commit 89772ae</span>
        </div>
      </aside>
      <main className="content">
        <AnimatePresence mode="wait">
          {tab === 'overview' && <Overview key="overview" />}
          {tab === 'task1'    && <Task1    key="task1" />}
          {tab === 'task2'    && <Task2    key="task2" />}
          {tab === 'task3'    && <Task3    key="task3" />}
          {tab === 'task4'    && <Task4    key="task4" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
