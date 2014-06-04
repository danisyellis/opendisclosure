class Party < ActiveRecord::Base
  has_many :received_contributions,
    foreign_key: :recipient_id,
    class_name: 'Contribution'
  has_many :contributions,
    foreign_key: :contributor_id,
    class_name: 'Contribution'
  has_many :summaries, primary_key: :committee_id

  # 6-3-14 Taylor
  # I changed these IDs to valid IDs from the SF data set.  The "Candidate Info" has NOT been updated.  
  MAYORAL_CANDIDATE_IDS = [
    PARKER = 990028,
    QUAN = 1362775,
    SCHAAF = 746875,
    TUMAN = 941562,
  ]

  CANDIDATE_INFO = {
    PARKER => {
      name: 'Bryan Parker',
      profession: 'Health Care and Tecnology Professional',
      party: 'Democrat'
    },
    QUAN => {
      name: 'Jean Quan',
      profession: 'Incumbant Oakland Mayor',
      party: 'Democrat'
    },
    SCHAAF => {
      name: 'Libby Schaaf',
      profession: 'Councilmember for District 4',
      party: 'Democrat'
    },
    TUMAN => {
      name: 'Joe Tuman',
      profession: 'University Professor',
      party: 'Independent'
    },
  }

  def self.mayoral_candidates
    where(committee_id: MAYORAL_CANDIDATE_IDS)
  end

  def latest_summary
    summaries.order(date: :desc).first
  end

  def short_name
    CANDIDATE_INFO.fetch(committee_id, {})[:name] || name
  end

  def profession
    CANDIDATE_INFO.fetch(committee_id, {})[:profession]
  end

  def party_affiliation
    CANDIDATE_INFO.fetch(committee_id, {})[:party]
  end

  def from_oakland?
    city =~ /Oakland/i
  end
end

class Party::Individual < Party
end

class Party::Other < Party
end

class Party::Committee < Party
end
