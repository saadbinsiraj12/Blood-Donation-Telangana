document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Scroll Animation
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Blood Request Form Submission
    const requestForm = document.getElementById('requestForm');
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const closeModalButtons = document.querySelectorAll('.close-modal, .modal-close-btn');
    
    // Sample data storage (in a real app, this would be a database)
    let bloodRequests = [];
    let bloodDonors = [];
    
    // Load sample data if localStorage is empty
    if (!localStorage.getItem('bloodRequests')) {
        bloodRequests = [
            {
                id: 1,
                patientName: 'Rahul Sharma',
                age: 32,
                bloodGroup: 'B+',
                hospital: 'Apollo Hospital, Hyderabad',
                district: 'Hyderabad',
                units: 2,
                contact: '9876543210',
                urgency: 'urgent',
                additionalInfo: 'Need for surgery tomorrow',
                date: new Date().toISOString()
            },
            {
                id: 2,
                patientName: 'Priya Patel',
                age: 45,
                bloodGroup: 'O-',
                hospital: 'Yashoda Hospital, Secunderabad',
                district: 'Hyderabad',
                units: 1,
                contact: '8765432109',
                urgency: 'emergency',
                additionalInfo: 'Accident victim',
                date: new Date().toISOString()
            }
        ];
        localStorage.setItem('bloodRequests', JSON.stringify(bloodRequests));
    } else {
        bloodRequests = JSON.parse(localStorage.getItem('bloodRequests'));
    }
    
    if (!localStorage.getItem('bloodDonors')) {
        bloodDonors = [
            {
                id: 1,
                donorName: 'Arjun Reddy',
                age: 28,
                bloodGroup: 'B+',
                lastDonation: '2023-05-15',
                district: 'Hyderabad',
                availability: 'immediate',
                contact: '7654321098',
                healthInfo: 'No health issues',
                date: new Date().toISOString()
            },
            {
                id: 2,
                donorName: 'Sunita Gupta',
                age: 35,
                bloodGroup: 'O-',
                lastDonation: '2023-03-20',
                district: 'Warangal Urban',
                availability: 'oncall',
                contact: '6543210987',
                healthInfo: 'Regular donor',
                date: new Date().toISOString()
            }
        ];
        localStorage.setItem('bloodDonors', JSON.stringify(bloodDonors));
    } else {
        bloodDonors = JSON.parse(localStorage.getItem('bloodDonors'));
    }
    
    // Update stats counters
    function updateStats() {
        // Animate numbers
        animateValue('donorsCount', 0, bloodDonors.length, 1500);
        animateValue('requestsCount', 0, bloodRequests.length, 1500);
    }
    
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            obj.innerHTML = value === end ? end.toLocaleString() + '+' : value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Form Submission for Blood Request
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newRequest = {
            id: Date.now(),
            patientName: document.getElementById('patientName').value,
            age: document.getElementById('patientAge').value,
            bloodGroup: document.getElementById('bloodGroupReq').value,
            hospital: document.getElementById('hospital').value,
            district: document.getElementById('districtReq').value,
            units: document.getElementById('unitsRequired').value,
            contact: document.getElementById('contactNumberReq').value,
            urgency: document.getElementById('urgency').value,
            additionalInfo: document.getElementById('additionalInfo').value,
            date: new Date().toISOString()
        };
        
        bloodRequests.push(newRequest);
        localStorage.setItem('bloodRequests', JSON.stringify(bloodRequests));
        
        // Show success message
        successMessage.textContent = `Your blood request for ${newRequest.bloodGroup} has been submitted successfully. Donors will contact you soon.`;
        successModal.classList.add('active');
        
        // Reset form
        requestForm.reset();
        
        // Update requests table
        renderRequestsTable();
        updateStats();
    });
    
    // Donate Blood Form Submission
    const donateForm = document.getElementById('donateForm');
    
    donateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newDonor = {
            id: Date.now(),
            donorName: document.getElementById('donorName').value,
            age: document.getElementById('donorAge').value,
            bloodGroup: document.getElementById('bloodGroupDonate').value,
            lastDonation: document.getElementById('lastDonation').value || 'Never',
            district: document.getElementById('districtDonate').value,
            availability: document.getElementById('availability').value,
            contact: document.getElementById('contactNumberDonate').value,
            healthInfo: document.getElementById('healthInfo').value,
            date: new Date().toISOString()
        };
        
        bloodDonors.push(newDonor);
        localStorage.setItem('bloodDonors', JSON.stringify(bloodDonors));
        
        // Show success message
        successMessage.textContent = `Thank you, ${newDonor.donorName}! You have been registered as a blood donor. You may be contacted when there's a need for ${newDonor.bloodGroup} blood in ${newDonor.district}.`;
        successModal.classList.add('active');
        
        // Reset form
        donateForm.reset();
        
        // Update donors table
        renderDonorsTable();
        updateStats();
    });
    
    // Close Modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            successModal.classList.remove('active');
            errorModal.classList.remove('active');
            document.getElementById('contactModal').classList.remove('active');
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
        if (e.target === errorModal) {
            errorModal.classList.remove('active');
        }
        if (e.target === document.getElementById('contactModal')) {
            document.getElementById('contactModal').classList.remove('active');
        }
    });
    
    // Render Donors Table
    function renderDonorsTable(filterBloodGroup = '', filterDistrict = '') {
        const donorTableBody = document.getElementById('donorTableBody');
        donorTableBody.innerHTML = '';
        
        let filteredDonors = [...bloodDonors];
        
        if (filterBloodGroup) {
            filteredDonors = filteredDonors.filter(donor => donor.bloodGroup === filterBloodGroup);
        }
        
        if (filterDistrict) {
            filteredDonors = filteredDonors.filter(donor => donor.district === filterDistrict);
        }
        
        if (filteredDonors.length === 0) {
            donorTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No donors found matching your criteria</td></tr>';
            return;
        }
        
        filteredDonors.forEach(donor => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            row.innerHTML = `
                <td>${donor.donorName}</td>
                <td>${donor.age}</td>
                <td>${donor.bloodGroup}</td>
                <td>${donor.district}</td>
                <td>${formatAvailability(donor.availability)}</td>
                <td>${donor.lastDonation === 'Never' ? 'Never' : formatDate(donor.lastDonation)}</td>
                <td><button class="contact-btn" data-contact="${donor.contact}" data-name="${donor.donorName}">Contact</button></td>
            `;
            
            donorTableBody.appendChild(row);
        });
        
        // Add event listeners to contact buttons
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showContactModal(this.getAttribute('data-name'), this.getAttribute('data-contact'));
            });
        });
    }
    
    // Render Requests Table
    function renderRequestsTable(filterBloodGroup = '', filterDistrict = '', filterUrgency = '') {
        const requestTableBody = document.getElementById('requestTableBody');
        requestTableBody.innerHTML = '';
        
        let filteredRequests = [...bloodRequests];
        
        if (filterBloodGroup) {
            filteredRequests = filteredRequests.filter(request => request.bloodGroup === filterBloodGroup);
        }
        
        if (filterDistrict) {
            filteredRequests = filteredRequests.filter(request => request.district === filterDistrict);
        }
        
        if (filterUrgency) {
            filteredRequests = filteredRequests.filter(request => request.urgency === filterUrgency);
        }
        
        if (filteredRequests.length === 0) {
            requestTableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No blood requests found matching your criteria</td></tr>';
            return;
        }
        
        // Sort by urgency: emergency > urgent > normal
        filteredRequests.sort((a, b) => {
            const urgencyOrder = { emergency: 1, urgent: 2, normal: 3 };
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        });
        
        filteredRequests.forEach(request => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            row.innerHTML = `
                <td>${request.patientName}</td>
                <td>${request.age}</td>
                <td>${request.bloodGroup}</td>
                <td>${request.hospital}</td>
                <td>${request.district}</td>
                <td>${request.units}</td>
                <td><span class="urgency-tag ${request.urgency}">${formatUrgency(request.urgency)}</span></td>
                <td><button class="contact-btn" data-contact="${request.contact}" data-name="${request.patientName}">Contact</button></td>
                <td><button class="donate-btn" data-bloodgroup="${request.bloodGroup}" data-district="${request.district}">Donate</button></td>
            `;
            
            requestTableBody.appendChild(row);
        });
        
        // Add event listeners to contact buttons
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showContactModal(this.getAttribute('data-name'), this.getAttribute('data-contact'));
            });
        });
        
        // Add event listeners to donate buttons
        document.querySelectorAll('.donate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const bloodGroup = this.getAttribute('data-bloodgroup');
                const district = this.getAttribute('data-district');
                
                // Filter donors table
                document.getElementById('searchBloodGroup').value = bloodGroup;
                document.getElementById('searchDistrict').value = district;
                
                // Trigger search
                searchDonors();
                
                // Scroll to donors section
                document.querySelector('#donors').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Show Contact Modal
    function showContactModal(name, contact) {
        const modal = document.getElementById('contactModal');
        const donorContactInfo = document.getElementById('donorContactInfo');
        const contactDonorBtn = document.getElementById('contactDonorBtn');
        
        donorContactInfo.innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Contact Number:</strong> ${contact}</p>
            <p class="note">Please be respectful when contacting. This is a life-saving service.</p>
        `;
        
        contactDonorBtn.href = `tel:${contact}`;
        modal.classList.add('active');
    }
    
    // Format Availability
    function formatAvailability(availability) {
        const availabilityMap = {
            immediate: 'Immediately',
            week: 'Within a Week',
            month: 'Within a Month',
            oncall: 'On Call Basis'
        };
        return availabilityMap[availability] || availability;
    }
    
    // Format Urgency
    function formatUrgency(urgency) {
        const urgencyMap = {
            emergency: 'Emergency',
            urgent: 'Urgent',
            normal: 'Normal'
        };
        return urgencyMap[urgency] || urgency;
    }
    
    // Format Date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN');
    }
    
    // Search Donors
    const searchDonorsBtn = document.getElementById('searchDonors');
    
    function searchDonors() {
        const bloodGroup = document.getElementById('searchBloodGroup').value;
        const district = document.getElementById('searchDistrict').value;
        
        renderDonorsTable(bloodGroup, district);
    }
    
    searchDonorsBtn.addEventListener('click', searchDonors);
    
    // Search Requests
    const searchRequestsBtn = document.getElementById('searchRequests');
    
    function searchRequests() {
        const bloodGroup = document.getElementById('searchRequestBloodGroup').value;
        const district = document.getElementById('searchRequestDistrict').value;
        const urgency = document.getElementById('searchUrgency').value;
        
        renderRequestsTable(bloodGroup, district, urgency);
    }
    
    searchRequestsBtn.addEventListener('click', searchRequests);
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    
    // Initialize tables and stats
    renderDonorsTable();
    renderRequestsTable();
    updateStats();
    
    // Set current year in footer
    document.querySelector('.footer-bottom p').innerHTML = `&copy; ${new Date().getFullYear()} Telangana Blood Network. All Rights Reserved.`;
});