package com.bidwise.comments.controllers;

import java.util.List;

import com.bidwise.comments.EmployeeNotFoundException;
import com.bidwise.comments.EmployeeRepository;
import com.bidwise.comments.model.Employee;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/comments")
class CommentsController {

    private final EmployeeRepository repository;

    CommentsController(EmployeeRepository repository) {
        this.repository = repository;
    }

    // Aggregate root
    // tag::get-aggregate-root[]
    @GetMapping()
    String all(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        System.out.println("-------------------------------------------");
        System.out.println(principal.getAttributes().toString());
        System.out.println("-------------------------------------------");

        return principal.getName() + " is your name.";
    }
    // end::get-aggregate-root[]

    @PostMapping()
    Employee newEmployee(@RequestBody Employee newEmployee) {
        return repository.save(newEmployee);
    }

    // Single item

    @GetMapping("{id}")
    Employee one(@PathVariable Long id) {

        return repository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    @PutMapping("{id}")
    Employee replaceEmployee(@RequestBody Employee newEmployee, @PathVariable Long id) {

        return repository.findById(id)
                .map(employee -> {
                    employee.setName(newEmployee.getName());
                    employee.setRole(newEmployee.getRole());
                    return repository.save(employee);
                })
                .orElseGet(() -> {
                    return repository.save(newEmployee);
                });
    }

    @DeleteMapping("{id}")
    void deleteEmployee(@PathVariable Long id) {
        repository.deleteById(id);
    }
}