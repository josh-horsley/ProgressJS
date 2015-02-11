var ProgressBar = function (target) {
    var pb = this;
    this.t = $(target);
    this.s = [];
    this.sLength = 0;

    //Check to make sure the target has the 'progress' class
    if (this.t.hasClass('progress') === false) {
        this.t.addClass('progress');
    }

    //Initial setup of the progress bar (param 's' = options)
    /*
    var s = {
	    sections: 5,  //<--number of sections in the progress bar
        sectionsInfo: [  //<--array of objects containing a label(optional), tip(optional tooltip), and isComplete(optional, pass true to the last section when you want to display green)
            { label: "Created", tip: "Created On 5/29/2014" },
            { label: "Section 1", tip: "Section 1 Completed 5/29/2014" },
            { label: "Start Date", tip: "Start Date Entered 5/29/2014" },
            { label: "Section 2", tip: "Section 2 In Progress" },
            { label: "Done!", isComplete: true }
        ]
    }
    */
    this.Setup = function (s) {
        var sLength = s.sections;

        pb.sLength = sLength;
        pb.s = [];

        for (var i = 0; i < s.sectionsInfo.length; i++) {
            pb.s.push(s.sectionsInfo[i]);
        }
        
        pb.Update(sLength, pb.s);
    };

    this.Clear = function () {
        pb.t.empty();
    };

    //Add a new section
    this.Add = function (sectionInfo) {
        pb.s.push(sectionInfo);
        pb.Update(pb.sLength, pb.s);
    };

    //Update the progress bar
    this.Update = function (sLength, s) {
        //Make sure we clear out the progress bar before reconstructing it
        pb.Clear();

        var width = (1 / sLength) * 100,
            hasToolTip = false,
            passedCurrent = false;

        for (var i = 0; i < sLength; i++) {
            var section = $('<div></div>')
                .addClass('progress-bar progress-bar-after progress-bar-primary')
                .css('width', width + '%');

            if (i === 0) {
                section.css({
                    borderTopLeftRadius: '4px',
                    borderBottomLeftRadius: '4px'
                });
            }

            if (s.length > i) {
                if (s[i].tip) {
                    section.attr({
                        "data-toggle": "tooltip",
                        "data-placement": "top",
                        "title": s[i].tip
                    }).addClass('tip');
                    hasToolTip = true;
                }
                if (s[i].label) {
                    section.text(s[i].label);
                }
            }

            if (passedCurrent === false) {
                if ((sLength - 1) === i && s[i].isComplete) {
                    //The progress bar is done and has been marked complete, display last section as green
                    section
                        .removeClass('progress-bar-after progress-bar-primary')
                        .addClass('progress-bar-success')
                        .css({
                            borderTopRightRadius: '4px',
                            borderBottomRightRadius: '4px'
                        });
                }else if ((s.length - 1) === i) { //This is the current section
                    section.removeClass('progress-bar-primary').addClass('progress-bar-danger');

                    if ((sLength - 1) === i) {
                        section.removeClass('progress-bar-after').css({
                            borderTopRightRadius: '4px',
                            borderBottomRightRadius: '4px'
                        });
                    } else {
                        section.addClass('progress-bar-danger-after');
                    }

                    passedCurrent = true;
                } else { //Add a white right border to show a split between sections
                    section.css('border-right', '1px solid white');
                }

                pb.t.append(section);
            }
        }

        if (hasToolTip) {
            $('.tip')
                .tooltip({ trigger: 'click hover' });
        }
    };

    //Update the last section currently in the sections array
    this.UpdateLast = function (sectionInfo) {
        //remove the last section
        pb.s.pop();
        pb.Add(sectionInfo);
    };
};
