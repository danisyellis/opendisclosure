OpenDisclosure.Candidate = Backbone.Model.extend({
  imagePath : function() {
    return '/images/' + this.attributes.short_name.split(' ').slice(-1) + '.png';
  },

  pctContributionsFromOakland : function() {
    return this.friendlyPct(1 - this.attributes.received_contributions_from_oakland /
                            this.attributes.received_contributions_count);
  },

  pctSmallContributions : function() {
    return this.friendlyPct((
	    this.attributes.small_donations +
	       this.attributes.latest_summary['total_unitemized_contributions']) / 
	    this.attributes.latest_summary['total_contributions_received']);
  },

  avgContribution : function () {
    return this.friendlyNumber(Math.round(
      this.attributes.latest_summary['total_contributions_received']/
      this.attributes.received_contributions_count));
  },

  friendlySummaryNumber : function(which) {
    return this.friendlyNumber(this.attributes.latest_summary[which]);
  },

  friendlyNumber : function(number) {
    return "$" + number;
  },

  friendlyPct : function(float) {
    return Math.round(float * 100) + "%";
  }
});
