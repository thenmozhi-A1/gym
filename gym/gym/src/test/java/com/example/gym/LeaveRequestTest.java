package com.example.gym;

import com.example.gym.entity.LeaveRequest;
import com.example.gym.entity.Staff;
import com.example.gym.entity.User;
import com.example.gym.repository.LeaveRequestRepository;
import com.example.gym.repository.StaffRepository;
import com.example.gym.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDate;

@SpringBootTest
public class LeaveRequestTest {
    @Autowired UserRepository userRepository;
    @Autowired LeaveRequestRepository leaveRequestRepository;

    @Test
    public void testLeave() {
        User u = new User();
        u.setEmail("testleave" + System.currentTimeMillis() + "@gym.com");
        u.setFullName("Test");
        u.setPassword("test");
        Staff s = new Staff();
        s.setUser(u);
        u.setStaffDetails(s);
        userRepository.save(u);

        LeaveRequest req = new LeaveRequest();
        req.setStaff(u.getStaffDetails());
        req.setStartDate(LocalDate.now());
        req.setEndDate(LocalDate.now().plusDays(1));
        req.setLeaveType("SICK");
        req.setReason("Testing");
        leaveRequestRepository.save(req);
        System.out.println("SUCCESSFULLY SAVED LEAVE REQUEST");
    }
}
