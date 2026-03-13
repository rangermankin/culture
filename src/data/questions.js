export const questions = [
  {
    id: 1,
    text: 'When a serious conflict is unavoidable, your instinct is to:',
    options: [
      {
        id: 'a',
        text: 'Get through it by any means available. Survival first, principles after.',
        weights: { cp: 2, uw: 1, sd: 1 },
      },
      {
        id: 'b',
        text: 'Find the optimal approach — study the situation, then act with precision.',
        weights: { pg: 2, inv: 1, ex: 1 },
      },
      {
        id: 'c',
        text: 'Hold the line on what you believe in, even if the cost is high.',
        weights: { sd: 2, ltw: 1, mat: 1 },
      },
      {
        id: 'd',
        text: 'Look for the angle others haven\'t seen — conflict rewards the lateral thinker.',
        weights: { inv: 2, pg: 1, ths: 1 },
      },
    ],
  },
  {
    id: 2,
    text: 'Your relationship with authority tends to be:',
    options: [
      {
        id: 'a',
        text: 'Adversarial by default. Power structures serve themselves, not the people inside them.',
        weights: { cp: 2, sd: 1, uw: 1 },
      },
      {
        id: 'b',
        text: 'Practical. You work within systems when useful, around them when not.',
        weights: { inv: 2, pg: 1, mat: 1 },
      },
      {
        id: 'c',
        text: 'Curious. You\'re interested in why power organises itself the way it does.',
        weights: { ex: 2, ths: 1, ltw: 1 },
      },
      {
        id: 'd',
        text: 'Detached. You follow your own internal compass; hierarchy is mostly noise.',
        weights: { ths: 2, uw: 1, cp: 1 },
      },
    ],
  },
  {
    id: 3,
    text: 'How do you tend to relate to your own past?',
    options: [
      {
        id: 'a',
        text: 'You carry it with you — not as burden exactly, but as something you can\'t put down.',
        weights: { uw: 2, ltw: 2 },
      },
      {
        id: 'b',
        text: 'You learn from it and move. Looking back too long is a trap.',
        weights: { cp: 2, pg: 1, mat: 1 },
      },
      {
        id: 'c',
        text: 'You\'re still working out what it means. Some parts haven\'t resolved yet.',
        weights: { mat: 2, ths: 1, inv: 1 },
      },
      {
        id: 'd',
        text: 'You\'ve built a kind of peace with it — given it a home so it doesn\'t flood everything.',
        weights: { ltw: 2, uw: 1, ths: 1 },
      },
    ],
  },
  {
    id: 4,
    text: 'Encountering a genuinely unknown thing — one with no clear explanation — makes you feel:',
    options: [
      {
        id: 'a',
        text: 'Deeply excited. The incomprehensible is where the interesting questions live.',
        weights: { ex: 3, ths: 1 },
      },
      {
        id: 'b',
        text: 'Alert and watchful. Unknown things deserve careful attention before engagement.',
        weights: { inv: 2, pg: 1, uw: 1 },
      },
      {
        id: 'c',
        text: 'Unsettled but drawn in. You can\'t ignore a gap in the map.',
        weights: { mat: 2, cp: 1, ex: 1 },
      },
      {
        id: 'd',
        text: 'Peaceful. Some things may never have explanations, and that\'s acceptable.',
        weights: { ths: 2, ltw: 1, inv: 1 },
      },
    ],
  },
  {
    id: 5,
    text: 'Your honest attitude toward artificial intelligence and advanced technology is:',
    options: [
      {
        id: 'a',
        text: 'Fascination. The emergence of non-human minds is one of the most important things that can happen.',
        weights: { ex: 3, ths: 1 },
      },
      {
        id: 'b',
        text: 'Appreciation. Powerful tools are powerful tools — the question is always who controls them.',
        weights: { inv: 2, pg: 1, sd: 1 },
      },
      {
        id: 'c',
        text: 'Measured scepticism. Technology solves some problems and creates others, usually new ones.',
        weights: { cp: 2, uw: 1, ltw: 1 },
      },
      {
        id: 'd',
        text: 'Philosophical equanimity. Whether minds are biological or synthetic matters less than what they do.',
        weights: { ths: 2, ex: 1, mat: 1 },
      },
    ],
  },
  {
    id: 6,
    text: 'When you want to change someone\'s mind about something important, you:',
    options: [
      {
        id: 'a',
        text: 'Let them believe they reached the conclusion themselves. Patience is the sharpest tool.',
        weights: { inv: 3, pg: 1 },
      },
      {
        id: 'b',
        text: 'Give them your best argument and accept the outcome. You can\'t force understanding.',
        weights: { ltw: 2, ths: 1, mat: 1 },
      },
      {
        id: 'c',
        text: 'Find what they actually care about and show how your position serves it.',
        weights: { pg: 2, ex: 1, sd: 1 },
      },
      {
        id: 'd',
        text: 'You don\'t, usually. People change when events force them to — not because of words.',
        weights: { cp: 2, uw: 1, ltw: 1 },
      },
    ],
  },
  {
    id: 7,
    text: 'When you lose something or someone that genuinely mattered:',
    options: [
      {
        id: 'a',
        text: 'You build a container for it. Grief needs somewhere specific to live — not everywhere at once.',
        weights: { ltw: 2, uw: 1, ths: 1 },
      },
      {
        id: 'b',
        text: 'You keep moving. Stillness is when the weight becomes unbearable.',
        weights: { cp: 2, mat: 1, pg: 1 },
      },
      {
        id: 'c',
        text: 'You want to understand it completely — trace every thread back to its origin.',
        weights: { uw: 2, ltw: 1, ths: 1 },
      },
      {
        id: 'd',
        text: 'You look for what can still be made right, even though the loss itself can\'t be undone.',
        weights: { sd: 2, inv: 1, mat: 1 },
      },
    ],
  },
  {
    id: 8,
    text: 'Given completely free time with no obligations, you\'re most likely to:',
    options: [
      {
        id: 'a',
        text: 'Engage deeply with a challenge that demands your full capacity — a game, a craft, a problem.',
        weights: { pg: 2, ths: 1, mat: 1 },
      },
      {
        id: 'b',
        text: 'Watch and absorb. People, systems, places — understanding things at their own pace.',
        weights: { inv: 2, ex: 1, ltw: 1 },
      },
      {
        id: 'c',
        text: 'Create something — music, writing, making — even if no one else ever sees it.',
        weights: { ltw: 2, ths: 1, uw: 1 },
      },
      {
        id: 'd',
        text: 'Plan something. A project, a trip, a change. Possibility feels better when it\'s mapped.',
        weights: { mat: 2, pg: 1, sd: 1 },
      },
    ],
  },
  {
    id: 9,
    text: 'The problems you find most genuinely interesting are:',
    options: [
      {
        id: 'a',
        text: 'Intimate and human — the choices a specific person makes in a specific moment.',
        weights: { uw: 2, inv: 1, ltw: 1 },
      },
      {
        id: 'b',
        text: 'Civilisational and long — why cultures rise, collapse, and what they leave behind.',
        weights: { ex: 2, ltw: 1, ths: 1 },
      },
      {
        id: 'c',
        text: 'Strategic and concrete — how to achieve a specific outcome against intelligent opposition.',
        weights: { pg: 2, sd: 1, inv: 1 },
      },
      {
        id: 'd',
        text: 'Existential and abstract — what makes a life, or a universe, worth anything at all.',
        weights: { ths: 2, cp: 1, ltw: 1 },
      },
    ],
  },
  {
    id: 10,
    text: 'Justice, to you, fundamentally means:',
    options: [
      {
        id: 'a',
        text: 'Accountability. The people who caused harm should face real consequences, even if it costs something.',
        weights: { sd: 3, cp: 1 },
      },
      {
        id: 'b',
        text: 'Prevention. The goal is systems that make injustice structurally difficult — not punishment afterward.',
        weights: { ex: 2, inv: 1, mat: 1 },
      },
      {
        id: 'c',
        text: 'Healing. Something was broken; the goal is to restore what can be restored.',
        weights: { ltw: 2, mat: 1, ths: 1 },
      },
      {
        id: 'd',
        text: 'Context. Most wrongdoing is produced by systems, not just individuals. Change the structure.',
        weights: { ex: 1, inv: 2, pg: 1 },
      },
    ],
  },
  {
    id: 11,
    text: 'The most accurate thing about how well you know yourself:',
    options: [
      {
        id: 'a',
        text: 'You know your capabilities precisely and your limits almost as precisely. You rarely surprise yourself.',
        weights: { pg: 2, uw: 1, inv: 1 },
      },
      {
        id: 'b',
        text: 'You\'ve found you\'re different in different contexts — which version is "you" is still an open question.',
        weights: { uw: 2, mat: 1, cp: 1 },
      },
      {
        id: 'c',
        text: 'You know what you value. Whether you actually live by it is a project in progress.',
        weights: { mat: 2, ths: 1, ltw: 1 },
      },
      {
        id: 'd',
        text: 'You sometimes discover what you think by watching what you do.',
        weights: { cp: 2, inv: 1, ths: 1 },
      },
    ],
  },
  {
    id: 12,
    text: 'Your natural relationship with long timescales is:',
    options: [
      {
        id: 'a',
        text: 'You think in generations. Most worthwhile things take longer than a single lifetime.',
        weights: { ex: 2, ths: 1, inv: 1 },
      },
      {
        id: 'b',
        text: 'You think in lives. One lifetime is enough to do something real if you\'re intentional.',
        weights: { pg: 2, mat: 1, sd: 1 },
      },
      {
        id: 'c',
        text: 'You think in moments. The long arc is real but meaning lives in the immediate and specific.',
        weights: { ltw: 2, cp: 1, uw: 1 },
      },
      {
        id: 'd',
        text: 'You\'ve made peace with not knowing. Some things resolve on timescales you\'ll never see.',
        weights: { ths: 2, ex: 1, ltw: 1 },
      },
    ],
  },
  {
    id: 13,
    text: 'The idea of becoming genuinely, fundamentally different from who you are now:',
    options: [
      {
        id: 'a',
        text: 'Sounds like a kind of loss. Continuity of self matters more than you can quite articulate.',
        weights: { ltw: 2, uw: 1, cp: 1 },
      },
      {
        id: 'b',
        text: 'Sounds like growth. You expect to be substantially different every decade.',
        weights: { mat: 2, pg: 1, ths: 1 },
      },
      {
        id: 'c',
        text: 'Depends on what\'s driving it. Transformation from insight is welcome; from pressure, less so.',
        weights: { pg: 2, inv: 1, uw: 1 },
      },
      {
        id: 'd',
        text: 'The most interesting question you can sit with. You\'re drawn to the threshold.',
        weights: { ths: 3, ex: 1 },
      },
    ],
  },
  {
    id: 14,
    text: 'Your attitude toward secrets — keeping them, being kept from them:',
    options: [
      {
        id: 'a',
        text: 'You keep what needs keeping and reveal what needs revealing. Information is a tool.',
        weights: { inv: 2, pg: 1, uw: 1 },
      },
      {
        id: 'b',
        text: 'You\'re suspicious of your own secrecy. Hidden things tend to fester.',
        weights: { sd: 2, uw: 1, ltw: 1 },
      },
      {
        id: 'c',
        text: 'Opacity is usually in service of power. Things that should be known should be known.',
        weights: { sd: 2, cp: 1, ex: 1 },
      },
      {
        id: 'd',
        text: 'You\'re genuinely at ease not knowing certain things. Not all truths are useful.',
        weights: { ths: 2, inv: 1, ltw: 1 },
      },
    ],
  },
  {
    id: 15,
    text: 'Life feels most meaningful when:',
    options: [
      {
        id: 'a',
        text: 'You\'re inside a challenge at the edge of your ability — completely absorbed, stakes are real.',
        weights: { pg: 2, cp: 1, mat: 1 },
      },
      {
        id: 'b',
        text: 'You\'re part of something larger than any individual life — connected to a long project.',
        weights: { ex: 2, inv: 1, ths: 1 },
      },
      {
        id: 'c',
        text: 'You\'re making something — a sound, an image, a relationship — that didn\'t exist before.',
        weights: { ltw: 2, ths: 1, mat: 1 },
      },
      {
        id: 'd',
        text: 'You\'re being honest about something difficult — with yourself or someone else.',
        weights: { uw: 2, sd: 1, cp: 1 },
      },
    ],
  },
  {
    id: 16,
    text: 'Your honest feeling about whether civilisation is improving:',
    options: [
      {
        id: 'a',
        text: 'Yes, on the long arc. The short arc is brutal, but the direction is forward.',
        weights: { mat: 2, ex: 1, pg: 1 },
      },
      {
        id: 'b',
        text: 'It depends entirely on the civilisation and the metric. You resist the generalisation.',
        weights: { inv: 2, ex: 1, ltw: 1 },
      },
      {
        id: 'c',
        text: 'Sceptical. Progress in one domain usually displaces suffering rather than eliminating it.',
        weights: { sd: 2, cp: 1, uw: 1 },
      },
      {
        id: 'd',
        text: 'The question is less interesting than what might come after civilisation entirely.',
        weights: { ths: 2, ex: 1, ltw: 1 },
      },
    ],
  },
  {
    id: 17,
    text: 'If you could choose, you\'d most want to be remembered as:',
    options: [
      {
        id: 'a',
        text: 'Someone who did what was necessary when it was necessary. Effective, not celebrated.',
        weights: { uw: 2, inv: 2 },
      },
      {
        id: 'b',
        text: 'Someone who made people feel or think something they hadn\'t before.',
        weights: { ltw: 2, pg: 1, sd: 1 },
      },
      {
        id: 'c',
        text: 'Someone who chose their own terms. Not fitting the expected mould.',
        weights: { cp: 2, mat: 1, ths: 1 },
      },
      {
        id: 'd',
        text: 'You\'re not sure you need to be remembered at all. The work was the point.',
        weights: { ths: 2, ex: 1, inv: 1 },
      },
    ],
  },
];
