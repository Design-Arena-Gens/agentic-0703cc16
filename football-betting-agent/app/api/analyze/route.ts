import { NextRequest, NextResponse } from 'next/server';

interface MatchRequest {
  homeTeam: string;
  awayTeam: string;
  league: string;
}

// Simulated AI analysis engine
function analyzeMatch(homeTeam: string, awayTeam: string, league: string) {
  // Generate realistic odds based on team names and league
  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);
  const homeAdvantage = 0.15;

  const totalStrength = homeStrength + homeAdvantage + awayStrength;

  const homeProbability = (homeStrength + homeAdvantage) / totalStrength;
  const awayProbability = awayStrength / totalStrength;
  const drawProbability = 1 - homeProbability - awayProbability + 0.1;

  // Normalize probabilities
  const total = homeProbability + drawProbability + awayProbability;
  const normHomeProbability = homeProbability / total;
  const normDrawProbability = drawProbability / total;
  const normAwayProbability = awayProbability / total;

  // Convert to odds (with bookmaker margin)
  const margin = 1.08;
  const homeOdds = (1 / normHomeProbability) * margin;
  const drawOdds = (1 / normDrawProbability) * margin;
  const awayOdds = (1 / normAwayProbability) * margin;

  // Determine prediction
  let prediction = '';
  let recommendedBet = '';
  let confidence = 0;

  if (normHomeProbability > normAwayProbability && normHomeProbability > normDrawProbability) {
    prediction = `${homeTeam} to win`;
    recommendedBet = `Back ${homeTeam} at ${homeOdds.toFixed(2)}`;
    confidence = Math.round(normHomeProbability * 100);
  } else if (normAwayProbability > normHomeProbability && normAwayProbability > normDrawProbability) {
    prediction = `${awayTeam} to win`;
    recommendedBet = `Back ${awayTeam} at ${awayOdds.toFixed(2)}`;
    confidence = Math.round(normAwayProbability * 100);
  } else {
    prediction = 'Draw';
    recommendedBet = `Back Draw at ${drawOdds.toFixed(2)}`;
    confidence = Math.round(normDrawProbability * 100);
  }

  // Generate analysis
  const analysis = generateAnalysis(homeTeam, awayTeam, league, homeStrength, awayStrength);
  const keyFactors = generateKeyFactors(homeTeam, awayTeam, homeStrength, awayStrength);

  return {
    match: {
      homeTeam,
      awayTeam,
      league,
      date: new Date().toLocaleDateString(),
    },
    prediction,
    confidence: Math.min(confidence, 85), // Cap at 85% for realism
    recommendedBet,
    odds: {
      home: homeOdds,
      draw: drawOdds,
      away: awayOdds,
    },
    analysis,
    keyFactors,
  };
}

function calculateTeamStrength(teamName: string): number {
  // Simple heuristic based on team name characteristics
  const name = teamName.toLowerCase();
  let strength = 0.5;

  // Premier League top teams
  const topTeams = ['manchester city', 'liverpool', 'arsenal', 'chelsea', 'manchester united', 'tottenham'];
  const goodTeams = ['newcastle', 'brighton', 'aston villa', 'west ham', 'real madrid', 'barcelona', 'bayern', 'psg'];

  if (topTeams.some(team => name.includes(team.split(' ')[0]))) {
    strength = 0.7 + Math.random() * 0.15;
  } else if (goodTeams.some(team => name.includes(team.split(' ')[0]))) {
    strength = 0.55 + Math.random() * 0.15;
  } else {
    strength = 0.4 + Math.random() * 0.2;
  }

  return strength;
}

function generateAnalysis(homeTeam: string, awayTeam: string, league: string, homeStrength: number, awayStrength: number): string {
  const strengthDiff = homeStrength - awayStrength;

  let analysis = `This ${league} fixture between ${homeTeam} and ${awayTeam} promises to be `;

  if (Math.abs(strengthDiff) < 0.1) {
    analysis += `a closely contested match. Both teams are evenly matched, with similar form and quality. `;
    analysis += `The home advantage could be decisive in such a tight encounter. `;
    analysis += `Expect a tactical battle with both teams looking to exploit any weaknesses.`;
  } else if (strengthDiff > 0.1) {
    analysis += `a favorable opportunity for ${homeTeam}. The home side has been showing strong form `;
    analysis += `and possesses a tactical advantage over ${awayTeam}. `;
    analysis += `The home crowd support combined with their recent performances suggests they should control the match. `;
    analysis += `However, football is unpredictable and ${awayTeam} will be looking to upset the odds.`;
  } else {
    analysis += `a challenging fixture for the home side. ${awayTeam} comes into this match with strong momentum `;
    analysis += `and a quality squad capable of getting results away from home. `;
    analysis += `${homeTeam} will need to leverage their home advantage and defensive organization to contain the visitors. `;
    analysis += `This could be a high-scoring affair if both teams commit to attacking play.`;
  }

  return analysis;
}

function generateKeyFactors(homeTeam: string, awayTeam: string, homeStrength: number, awayStrength: number): string[] {
  const factors = [
    `Home advantage for ${homeTeam} - statistically worth 0.3-0.5 goals`,
    `Recent form indicators suggest ${homeStrength > awayStrength ? homeTeam : awayTeam} has momentum`,
    `Head-to-head history shows competitive fixtures between these teams`,
  ];

  if (homeStrength > awayStrength + 0.15) {
    factors.push(`${homeTeam}'s attacking prowess has been exceptional in recent matches`);
    factors.push(`${awayTeam} may struggle defensively against ${homeTeam}'s pressing style`);
  } else if (awayStrength > homeStrength + 0.15) {
    factors.push(`${awayTeam}'s away record has been impressive this season`);
    factors.push(`${homeTeam} has shown vulnerability in defensive transitions`);
  } else {
    factors.push(`Both teams have similar goal-scoring records this season`);
    factors.push(`Tactical matchup favors a cautious approach from both managers`);
  }

  factors.push(`Weather and pitch conditions expected to be favorable for open play`);

  return factors;
}

export async function POST(request: NextRequest) {
  try {
    const body: MatchRequest = await request.json();
    const { homeTeam, awayTeam, league } = body;

    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate processing time for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = analyzeMatch(homeTeam, awayTeam, league);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze match' },
      { status: 500 }
    );
  }
}
