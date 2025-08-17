interface ClaudeIssue {
  id: string
  timestamp: Date
  type: 'supabase' | 'database' | 'api' | 'sync' | 'system'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  context: any
  autoFixAttempted: boolean
  autoFixResult?: string
  status: 'pending' | 'in_progress' | 'resolved' | 'failed'
  claudeResponse?: string
}

class ClaudeIntegration {
  private issueQueue: ClaudeIssue[] = []
  private readonly MAX_QUEUE_SIZE = 50

  // Add an issue to the Claude queue when auto-fix fails
  addIssue(issue: Omit<ClaudeIssue, 'id' | 'timestamp' | 'status'>): string {
    const claudeIssue: ClaudeIssue = {
      id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: 'pending',
      ...issue
    }

    this.issueQueue.unshift(claudeIssue)
    
    // Keep queue size manageable
    if (this.issueQueue.length > this.MAX_QUEUE_SIZE) {
      this.issueQueue = this.issueQueue.slice(0, this.MAX_QUEUE_SIZE)
    }

    console.log(`🤖 Added issue to Claude queue: ${claudeIssue.title}`)
    return claudeIssue.id
  }

  // Get all pending issues for Claude to review
  getPendingIssues(): ClaudeIssue[] {
    return this.issueQueue.filter(issue => issue.status === 'pending')
  }

  // Get a specific issue by ID
  getIssue(id: string): ClaudeIssue | undefined {
    return this.issueQueue.find(issue => issue.id === id)
  }

  // Mark an issue as being handled by Claude
  markInProgress(id: string): boolean {
    const issue = this.getIssue(id)
    if (issue) {
      issue.status = 'in_progress'
      return true
    }
    return false
  }

  // Mark an issue as resolved by Claude
  resolveIssue(id: string, claudeResponse: string): boolean {
    const issue = this.getIssue(id)
    if (issue) {
      issue.status = 'resolved'
      issue.claudeResponse = claudeResponse
      return true
    }
    return false
  }

  // Get issue summary for display
  getIssueSummary() {
    const pending = this.issueQueue.filter(i => i.status === 'pending').length
    const inProgress = this.issueQueue.filter(i => i.status === 'in_progress').length
    const resolved = this.issueQueue.filter(i => i.status === 'resolved').length
    const failed = this.issueQueue.filter(i => i.status === 'failed').length

    return {
      total: this.issueQueue.length,
      pending,
      inProgress,
      resolved,
      failed,
      criticalCount: this.issueQueue.filter(i => i.severity === 'critical' && i.status === 'pending').length
    }
  }

  // Generate a formatted issue report for Claude
  generateIssueReport(): string {
    const pendingIssues = this.getPendingIssues()
    
    if (pendingIssues.length === 0) {
      return "✅ No pending issues! System is running smoothly."
    }

    let report = `🚨 CLAUDE ISSUE QUEUE - ${pendingIssues.length} Pending Issues\n\n`
    
    // Sort by severity (critical first)
    const sortedIssues = pendingIssues.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })

    sortedIssues.forEach((issue, index) => {
      const emoji = {
        critical: '🔴',
        high: '🟠', 
        medium: '🟡',
        low: '🟢'
      }[issue.severity]

      report += `${index + 1}. ${emoji} [${issue.type.toUpperCase()}] ${issue.title}\n`
      report += `   ID: ${issue.id}\n`
      report += `   Severity: ${issue.severity}\n`
      report += `   Time: ${issue.timestamp.toLocaleString()}\n`
      report += `   Description: ${issue.description}\n`
      
      if (issue.autoFixAttempted) {
        report += `   Auto-fix attempted: ${issue.autoFixResult || 'Failed'}\n`
      }
      
      if (issue.context) {
        report += `   Context: ${JSON.stringify(issue.context, null, 2)}\n`
      }
      
      report += `\n`
    })

    report += `\n💡 To resolve an issue, use the issue ID with the /resolve command.`
    
    return report
  }

  // Clear resolved issues older than 24 hours
  cleanupOldIssues(): number {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const initialLength = this.issueQueue.length
    
    this.issueQueue = this.issueQueue.filter(issue => {
      if (issue.status === 'resolved' && issue.timestamp < oneDayAgo) {
        return false
      }
      return true
    })

    const removed = initialLength - this.issueQueue.length
    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} old resolved issues`)
    }
    
    return removed
  }

  // Get issues for API endpoint
  getIssuesForApi() {
    return {
      summary: this.getIssueSummary(),
      issues: this.issueQueue.map(issue => ({
        ...issue,
        context: typeof issue.context === 'object' ? 
          JSON.stringify(issue.context) : issue.context
      }))
    }
  }
}

// Singleton instance
export const claudeIntegration = new ClaudeIntegration()
export type { ClaudeIssue }