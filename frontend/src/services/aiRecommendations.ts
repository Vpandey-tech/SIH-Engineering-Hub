
import { pipeline } from '@huggingface/transformers';

class AIRecommendationService {
  private textClassifier: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Initialize text classification pipeline for analyzing user goals and preferences
      this.textClassifier = await pipeline(
        'text-classification',
        'microsoft/DialoGPT-medium',
        { device: 'cpu' }
      );
      this.initialized = true;
      console.log('AI Recommendation Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      // Fallback to rule-based recommendations
      this.initialized = true;
    }
  }

  async generatePersonalizedRecommendations(userProfile: {
    branch: string;
    year: string;
    subjects: string;
    goals: string;
    studyTime: string;
  }) {
    await this.initialize();

    try {
      // Analyze user goals to determine focus areas
      const goalAnalysis = await this.analyzeGoals(userProfile.goals);
      
      // Generate study roadmap based on profile
      const roadmap = this.generateStudyRoadmap(userProfile, goalAnalysis);
      
      // Generate time management recommendations
      const timeManagement = this.generateTimeManagementTips(userProfile.studyTime, userProfile.year);
      
      // Generate material recommendations
      const materials = this.generateMaterialRecommendations(userProfile.branch, userProfile.subjects);

      return {
        roadmap,
        timeManagement,
        materials,
        personalizedInsights: this.generatePersonalizedInsights(userProfile, goalAnalysis)
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(userProfile);
    }
  }

  private async analyzeGoals(goals: string) {
    if (!goals || !this.textClassifier) {
      return { focus: 'general', confidence: 0.5 };
    }

    try {
      // Analyze the sentiment and focus of user goals
      const keywords = goals.toLowerCase();
      
      let focus = 'general';
      let confidence = 0.7;

      if (keywords.includes('software') || keywords.includes('programming') || keywords.includes('developer')) {
        focus = 'software';
        confidence = 0.9;
      } else if (keywords.includes('research') || keywords.includes('phd') || keywords.includes('academic')) {
        focus = 'research';
        confidence = 0.85;
      } else if (keywords.includes('industry') || keywords.includes('job') || keywords.includes('career')) {
        focus = 'industry';
        confidence = 0.8;
      } else if (keywords.includes('startup') || keywords.includes('entrepreneur')) {
        focus = 'entrepreneurship';
        confidence = 0.75;
      }

      return { focus, confidence };
    } catch (error) {
      console.error('Goal analysis failed:', error);
      return { focus: 'general', confidence: 0.5 };
    }
  }

  private generateStudyRoadmap(userProfile: any, goalAnalysis: any) {
    const { branch, year, subjects } = userProfile;
    const { focus } = goalAnalysis;

    const roadmapTemplates = {
      'Computer Science': {
        foundation: ['Programming Fundamentals', 'Data Structures', 'Algorithms', 'Object-Oriented Programming'],
        intermediate: ['Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering'],
        advanced: ['Machine Learning', 'Distributed Systems', 'Cloud Computing', 'Security']
      },
      'Electrical Engineering': {
        foundation: ['Circuit Analysis', 'Digital Logic', 'Electronics', 'Mathematics'],
        intermediate: ['Control Systems', 'Power Systems', 'Signal Processing', 'Microprocessors'],
        advanced: ['Power Electronics', 'VLSI Design', 'Renewable Energy', 'Automation']
      }
    };

    const template = roadmapTemplates[branch as keyof typeof roadmapTemplates] || roadmapTemplates['Computer Science'];
    
    let roadmap = [];
    if (year === '1st Year' || year === '2nd Year') {
      roadmap = template.foundation;
    } else if (year === '3rd Year') {
      roadmap = [...template.foundation.slice(-2), ...template.intermediate];
    } else {
      roadmap = [...template.intermediate.slice(-2), ...template.advanced];
    }

    // Customize based on focus
    if (focus === 'software') {
      roadmap = roadmap.filter(item => 
        item.includes('Programming') || 
        item.includes('Software') || 
        item.includes('Data') ||
        item.includes('Algorithm')
      );
    }

    return roadmap;
  }

  private generateTimeManagementTips(studyTime: string, year: string) {
    const baseTime = parseInt(studyTime.split('-')[0]) || 1;
    
    const tips = [];
    
    if (baseTime <= 2) {
      tips.push('Use the Pomodoro Technique (25-min focused sessions)');
      tips.push('Focus on high-impact topics first');
      tips.push('Review notes before sleeping for better retention');
    } else if (baseTime <= 4) {
      tips.push('Split into morning and evening sessions');
      tips.push('Include 15-minute breaks every hour');
      tips.push('Practice active recall and spaced repetition');
    } else if (baseTime <= 6) {
      tips.push('Create a detailed daily schedule');
      tips.push('Include hands-on practice and projects');
      tips.push('Teach concepts to others for better understanding');
    } else {
      tips.push('Design intensive study blocks with strategic breaks');
      tips.push('Include research and self-directed learning');
      tips.push('Participate in study groups and peer teaching');
    }

    // Year-specific tips
    if (year === '1st Year') {
      tips.push('Focus on building strong fundamentals');
      tips.push('Develop good study habits early');
    } else if (year === '4th Year') {
      tips.push('Balance academics with job/higher studies preparation');
      tips.push('Work on practical projects and portfolio');
    }

    return tips.slice(0, 4); // Return top 4 tips
  }

  private generateMaterialRecommendations(branch: string, subjects: string) {
    const subjectList = subjects.split(',').map(s => s.trim().toLowerCase());
    
    const recommendations = [];
    
    // Branch-specific recommendations
    if (branch === 'Computer Science') {
      recommendations.push({
        title: 'Introduction to Algorithms (CLRS)',
        type: 'Book',
        priority: 'High',
        subjects: ['algorithms', 'data structures']
      });
      recommendations.push({
        title: 'LeetCode Practice Platform',
        type: 'Platform',
        priority: 'High',
        subjects: ['programming', 'algorithms']
      });
    } else if (branch === 'Electrical Engineering') {
      recommendations.push({
        title: 'Fundamentals of Electric Circuits',
        type: 'Book',
        priority: 'High',
        subjects: ['circuits', 'electronics']
      });
    }

    // Subject-specific recommendations
    subjectList.forEach(subject => {
      if (subject.includes('calculus') || subject.includes('math')) {
        recommendations.push({
          title: 'Khan Academy Calculus Course',
          type: 'Video',
          priority: 'Medium',
          subjects: ['mathematics']
        });
      }
      if (subject.includes('physics')) {
        recommendations.push({
          title: 'Physics for Scientists and Engineers',
          type: 'Book',
          priority: 'High',
          subjects: ['physics']
        });
      }
    });

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  private generatePersonalizedInsights(userProfile: any, goalAnalysis: any) {
    const insights = [];
    
    if (goalAnalysis.focus === 'software') {
      insights.push('Focus on building a strong programming portfolio with GitHub projects');
      insights.push('Consider participating in coding competitions and hackathons');
    } else if (goalAnalysis.focus === 'research') {
      insights.push('Start reading research papers in your field of interest');
      insights.push('Consider reaching out to professors for research opportunities');
    }

    if (userProfile.year === '1st Year') {
      insights.push('This is the perfect time to build strong fundamentals');
      insights.push('Explore different areas to find your passion');
    } else if (userProfile.year === '4th Year') {
      insights.push('Focus on practical projects and industry-relevant skills');
      insights.push('Start preparing for job interviews or higher studies');
    }

    return insights.slice(0, 3);
  }

  private getFallbackRecommendations(userProfile: any) {
    // Fallback recommendations when AI fails
    return {
      roadmap: ['Mathematics', 'Programming', 'Core Engineering Subjects', 'Practical Projects'],
      timeManagement: [
        'Create a consistent study schedule',
        'Take regular breaks to avoid burnout',
        'Review material regularly',
        'Practice active learning techniques'
      ],
      materials: [
        { title: 'Engineering Fundamentals Textbook', type: 'Book', priority: 'High' },
        { title: 'Online Learning Platform', type: 'Platform', priority: 'Medium' },
        { title: 'Video Lectures', type: 'Video', priority: 'Medium' }
      ],
      personalizedInsights: [
        'Consistency is key to academic success',
        'Build practical skills alongside theoretical knowledge',
        'Connect with peers and professors for guidance'
      ]
    };
  }
}

export const aiRecommendationService = new AIRecommendationService();
